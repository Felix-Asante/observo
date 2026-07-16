export const LOG_STREAM_NAME = 'Observo_Logs';
export const LOG_INGEST_SUBJECT = 'logs.ingest';
export const LOG_CONSUMER_DURABLE = 'observo-log-worker';

const STREAM_NOT_FOUND_CODE = 10059;
const CONSUMER_NOT_FOUND_CODE = 10014;

type NatsApiError = Error & {
  api_error?: {
    /** NATS JS clients use `err_code`; some typings say `error_code`. */
    err_code?: number;
    error_code?: number;
    code?: number;
    description?: string;
  };
};

function apiErrCode(error: NatsApiError): number | undefined {
  return error.api_error?.err_code ?? error.api_error?.error_code;
}

export function isStreamNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const apiError = error as NatsApiError;
  const code = apiErrCode(apiError);

  return (
    code === STREAM_NOT_FOUND_CODE ||
    apiError.message === 'stream not found' ||
    apiError.api_error?.description === 'stream not found'
  );
}

export function isConsumerNotFound(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const apiError = error as NatsApiError;
  const code = apiErrCode(apiError);

  return (
    code === CONSUMER_NOT_FOUND_CODE ||
    apiError.message === 'consumer not found' ||
    apiError.api_error?.description === 'consumer not found'
  );
}
