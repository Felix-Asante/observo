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
        subjects: [...subjects, subject],
      });
      console.log(`NATS stream ${streamName} updated with subject ${subject}`);
    }
    console.log(
      `NATS stream ${streamName} initialized with subject ${subject}`,
    );
  } catch (error) {
    console.error('NATS stream initialization error', error);
  }
}
