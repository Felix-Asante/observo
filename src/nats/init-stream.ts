import { RetentionPolicy, StorageType } from 'nats';
import { getNats } from './index';

export async function initNatStream() {
  const { natsConnection } = await getNats();

  const jsm = await natsConnection.jetstreamManager();

  await jsm.streams.add({
    name: 'Observo.Logs',
    subjects: ['Observo.Logs.*'],
    retention: RetentionPolicy.Workqueue,
    storage: StorageType.File,
    max_age: 0,
    max_msgs: -1,
  });

  console.log('NATS stream Observo.Logs initialized');
}
