export const LOG_STREAM_NAME = 'Observo_Logs';
export const LOG_INGEST_SUBJECT = 'logs.ingest';
export const LOG_CONSUMER_DURABLE = 'observo-log-worker';

const STREAM_NOT_FOUND_CODE = 10059;
const CONSUMER_NOT_FOUND_CODE = 10014;

export function isStreamNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const apiError = error as Error & {
    api_error?: { error_code?: number };
  };

  return apiError.api_error?.error_code === STREAM_NOT_FOUND_CODE;
}

export function isConsumerNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const apiError = error as Error & {
    api_error?: { error_code?: number };
  };

  return (
    apiError.api_error?.error_code === CONSUMER_NOT_FOUND_CODE ||
    apiError.message === 'consumer not found'
  );
}
