import { getNats } from './index';
import {
  isStreamNotFound,
  LOG_INGEST_SUBJECT,
  LOG_STREAM_NAME,
} from './constants';

export async function initNatsStream() {
  const { natsConnection } = await getNats();
  const jsm = await natsConnection.jetstreamManager();

  try {
    const existing = await jsm.streams.info(LOG_STREAM_NAME);
    const subjects = existing.config.subjects ?? [];

    if (!subjects.includes(LOG_INGEST_SUBJECT)) {
      await jsm.streams.update(LOG_STREAM_NAME, {
        subjects: [...subjects, LOG_INGEST_SUBJECT],
      });
      console.log(
        `NATS stream ${LOG_STREAM_NAME} updated with subject ${LOG_INGEST_SUBJECT}`,
      );
      return;
    }

    console.log(`NATS stream ${LOG_STREAM_NAME} already configured`);
  } catch (error: unknown) {
    if (!isStreamNotFound(error)) {
      console.error('NATS stream initialization error', error);
      throw error;
    }

    await jsm.streams.add({
      name: LOG_STREAM_NAME,
      subjects: [LOG_INGEST_SUBJECT],
    });
    console.log(
      `NATS stream ${LOG_STREAM_NAME} created with subject ${LOG_INGEST_SUBJECT}`,
    );
  }
}
