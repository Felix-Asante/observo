import { RetentionPolicy, StorageType } from 'nats';
import { getNats } from './index';

const streamName = 'Observo_Logs';
const subject = 'logs.ingest';

export async function initNatsStream() {
  const { natsConnection } = await getNats();
  const jsm = await natsConnection.jetstreamManager();

  try {
    const existing = await jsm.streams.info(streamName);
    const subjects = existing.config.subjects ?? [];

    if (!subjects.includes(subject)) {
      await jsm.streams.update(streamName, {
        ...existing.config,
        subjects: [...subjects, subject],
      });
      console.log(`NATS stream ${streamName} updated with subject ${subject}`);
    } else {
      console.log(
        `NATS stream ${streamName} already initialized with subject ${subject}`,
      );
    }
  } catch {
    await jsm.streams.add({
      name: streamName,
      subjects: [subject],
      retention: RetentionPolicy.Limits,
      storage: StorageType.File,
      max_msgs: -1,
      max_bytes: -1,
    });
    console.log(`NATS stream ${streamName} created with subject ${subject}`);
  }
}
