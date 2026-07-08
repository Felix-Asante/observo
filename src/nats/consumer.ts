import { consumerOpts } from 'nats';
import { getNats } from './index';
import { ENV } from '~/app.environment';
import Redis from 'ioredis';
import { clickhouseClient } from '~/clickhouse/client';
import type { LogPayload } from './types';
import { broadcastLogs } from '~/sse/sse-registry';

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

let lastBacklogUpdate = 0;

export async function startLogConsumer() {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();
  const jsm = await natsConnection.jetstreamManager();

  const durable = 'observo-log-worker';
  const subject = 'logs.ingest';
  const streamName = 'Observo_Logs';

  const opts = consumerOpts();
  opts.durable(durable);
  opts.deliverAll();
  opts.deliverLast();
  opts.deliverLastPerSubject();
  opts.deliverLastPerSubject();

  try {
    const existingConsumer = await jsm.consumers.info(streamName, durable);
    const cfg = existingConsumer.config;
    if (cfg && !cfg.deliver_subject) {
      console.warn(
        `Jetstream durable ${durable} is pulled-based(missing deliver_subject)`,
      );

      await jsm.consumers.delete(streamName, durable);
    }
  } catch (error) {
    console.error(error);
  }

  const sub = await js.subscribe(subject, opts);

  console.log('Observo Log Consumer started');

  for await (const msg of sub) {
    try {
      const data = jc.decode(msg.data);
      const { keyId, logs, userId, serverReceivedAt } = data as {
        keyId: string;
        serverReceivedAt: number;
        logs: LogPayload[];
        userId: string;
      };

      const now = Date.now();
      const latency = now - serverReceivedAt;
      const transformedLogs = await Promise.all(
        logs.map(async (log) => {
          await Promise.all([
            redis.lpush('ingest:latency', latency),
            redis.ltrim('ingest:latency', 0, 59),
          ]);

          const ts = log?.timestamps?.event_time
            ? new Date(log.timestamps.event_time).getTime()
            : now;
          const timestampSec = Math.floor(ts / 1000);

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
            ingestedAt: log.ingested_at,
          };
        }),
      );

      await clickhouseClient.insert({
        table: 'logs.events',
        values: transformedLogs,
        format: 'JSONEachRow',
      });

      // bordcast live logs
      broadcastLogs(transformedLogs);

      msg.ack();

      if (now - lastBacklogUpdate > 1000) {
        lastBacklogUpdate = now;
        const info = await jsm.consumers.info(streamName, durable);
        const backlog = info.num_pending ?? info.num_ack_pending ?? 0;

        await redis.set('ingest:backlog', backlog);
      }
    } catch (error) {
      console.error('consumer error', error);
    }
  }
}

function toImportance(importance?: string) {
  if (typeof importance === 'number') return importance;
  if (typeof importance === 'string') {
    const v = importanceMap[importance.toLowerCase()];
    return v ?? 1;
  }
  return 1;
}
