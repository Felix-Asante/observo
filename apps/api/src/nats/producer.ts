import { getNats } from './index';
import { LOG_INGEST_SUBJECT } from './constants';

export async function publishLogBatch(
  keyId: string,
  userId: string,
  logs: any[],
  serverReceivedAt: number,
) {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();

  await js.publish(
    LOG_INGEST_SUBJECT,
    jc.encode({
      keyId,
      userId,
      logs,
      serverReceivedAt,
      timestamp: Date.now(),
    }),
  );
}
