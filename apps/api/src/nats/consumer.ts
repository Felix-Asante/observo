import {
  AckPolicy,
  DeliverPolicy,
  type JetStreamManager,
  type JsMsg,
  type JSONCodec,
} from 'nats';
import { getNats } from './index';
import { initNatsStream } from './init-stream';
import { ENV } from '~/app.environment';
import Redis from 'ioredis';
import { clickhouseClient } from '~/clickhouse/client';
import { LOGS_EVENTS_TABLE } from '~/clickhouse/schema';
import type { LogPayload } from './types';
import { broadcastLogs } from '~/sse/sse-registry';
import {
  isConsumerNotFound,
  isStreamNotFound,
  LOG_CONSUMER_DURABLE,
  LOG_INGEST_SUBJECT,
  LOG_STREAM_NAME,
} from './constants';

const redis = new Redis({
  host: ENV.REDIS_HOST,
  port: Number(ENV.REDIS_PORT) || 6379,
  password: ENV.REDIS_PASSWORD || undefined,
  db: Number(ENV.REDIS_DB) || 0,
  maxRetriesPerRequest: 5,
  reconnectOnError: (error) => {
    const targetError = 'READONLY';
    if (error.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  retryStrategy: (times) => {
    return Math.min(times * 200, 10000);
  },
});

const importanceMap: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const CONSUME_BATCH_SIZE = 25;

let lastBacklogUpdate = 0;

type IngestMessage = {
  keyId: string;
  serverReceivedAt: number;
  logs: LogPayload[];
  userId: string;
};

export async function startLogConsumer() {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();
  const jsm = await natsConnection.jetstreamManager();

  // Ensure stream exists before binding the durable consumer (fresh JetStream nodes).
  await initNatsStream();

  await ensurePullConsumer(jsm);

  const consumer = await js.consumers.get(
    LOG_STREAM_NAME,
    LOG_CONSUMER_DURABLE,
  );
  const messages = await consumer.consume({
    max_messages: CONSUME_BATCH_SIZE,
  });

  console.log('Observo Log Consumer started');

  for await (const msg of messages) {
    await handleMessage(msg, jc, jsm);
  }
}

async function ensurePullConsumer(jsm: JetStreamManager) {
  try {
    const existing = await jsm.consumers.info(
      LOG_STREAM_NAME,
      LOG_CONSUMER_DURABLE,
    );

    if (existing.config.deliver_subject) {
      console.warn(
        `Deleting stale push consumer ${LOG_CONSUMER_DURABLE}; recreating as pull consumer`,
      );

      await jsm.consumers.delete(LOG_STREAM_NAME, LOG_CONSUMER_DURABLE);
    } else {
      return;
    }
  } catch (error) {
    if (isStreamNotFound(error)) {
      await initNatsStream();
    } else if (!isConsumerNotFound(error)) {
      console.error('JetStream consumer check failed', error);
      throw error;
    }
  }

  await jsm.consumers.add(LOG_STREAM_NAME, {
    durable_name: LOG_CONSUMER_DURABLE,
    filter_subject: LOG_INGEST_SUBJECT,
    ack_policy: AckPolicy.Explicit,
    deliver_policy: DeliverPolicy.New,
  });
}

async function handleMessage(
  msg: JsMsg,
  jc: ReturnType<typeof JSONCodec>,
  jsm: JetStreamManager,
) {
  try {
    const data = jc.decode(msg.data) as Partial<IngestMessage>;
    const { keyId, logs, userId, serverReceivedAt } = data;

    if (
      !keyId ||
      !userId ||
      typeof serverReceivedAt !== 'number' ||
      !Array.isArray(logs) ||
      logs.length === 0
    ) {
      console.warn('consumer skipped invalid ingest message');
      msg.ack();
      return;
    }

    const now = Date.now();
    const latency = now - serverReceivedAt;

    await Promise.all([
      redis.lpush('ingest:latency', latency),
      redis.ltrim('ingest:latency', 0, 59),
    ]);

    const transformedLogs = logs.map((log) => {
      const ts = log?.timestamps?.event_time
        ? new Date(log.timestamps.event_time).getTime()
        : now;
      const timestampSec = Math.floor(ts / 1000);
      const ingestedAtSec = log.ingested_at
        ? Math.floor(log.ingested_at / 1000)
        : timestampSec;

      return {
        keyId,
        userId,
        type: log.type,
        message: log.message,
        service: log.service,
        appName: log.app_name,
        environment: log.environment,
        importance: toImportance(log.importance),
        subsystem: log.subsystem ?? null,
        operation: log.operation ?? null,
        track: log.track ? JSON.stringify(log.track) : null,
        security: log.security ? JSON.stringify(log.security) : null,
        metrics: log.metrics ? JSON.stringify(log.metrics) : null,
        timestamp: timestampSec,
        ingestedAt: ingestedAtSec,
      };
    });

    await clickhouseClient.insert({
      table: LOGS_EVENTS_TABLE,
      values: transformedLogs,
      format: 'JSONEachRow',
    });

    broadcastLogs(transformedLogs);

    msg.ack();

    if (now - lastBacklogUpdate > 1000) {
      lastBacklogUpdate = now;
      const info = await jsm.consumers.info(
        LOG_STREAM_NAME,
        LOG_CONSUMER_DURABLE,
      );
      const backlog = info.num_pending ?? info.num_ack_pending ?? 0;

      await redis.set('ingest:backlog', backlog);
    }
  } catch (error) {
    console.error('consumer error', error);
    msg.nak();
  }
}

function toImportance(importance?: string | number) {
  if (typeof importance === 'number') return importance;
  if (typeof importance === 'string') {
    const v = importanceMap[importance.toLowerCase()];
    return v ?? 1;
  }
  return 1;
}
