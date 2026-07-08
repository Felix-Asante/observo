import { getNats } from './index';

export async function publishLogBatch(
  keyId: string,
  userId: string,
  logs: any[],
  serverReceivedAt: number,
) {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();

  await js.publish(
    'logs.ingest',
    jc.encode({
      keyId,
      userId,
      logs,
      serverReceivedAt,
      timestamp: Date.now(),
    }),
  );
}
