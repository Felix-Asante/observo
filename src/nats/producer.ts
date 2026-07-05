import { getNats } from './index';

export async function publishLogBatch(
  keyId: string,
  logs: any[],
  serverReceivedAt: number,
) {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();

  await js.publish('log.ingest', jc.encode({}));
}
