export const LOG_TYPES = [
  'info',
  'error',
  'warning',
  'debug',
  'trace',
  'audit',
  'success',
] as const

export type LogType = (typeof LOG_TYPES)[number]

export type LogImportance = 'critical' | 'high' | 'medium' | 'low'
export type LogSubsystem = 'db' | 'cache' | 'queue' | 'network'

export type ObservoLogInput = {
  type?: LogType
  message: string
  importance?: LogImportance
  subsystem?: LogSubsystem
  operation?: string
  app_name?: string
  environment?: string
  track?: Record<string, unknown>
  security?: Record<string, unknown>
  metrics?: {
    latency_ms?: number
    db_query_count?: number
  }
  timestamps?: {
    event_time: string
    ingest_time: string
  }
}

export type ObservoLogFields = Omit<ObservoLogInput, 'message' | 'type'>

export type ObservoErrorContext = {
  /** Why the error was reported. */
  phase: 'flush' | 'enqueue' | 'shutdown'
  /** Events involved when relevant. */
  batchSize?: number
  /** Attempt number that failed (1-based). */
  attempt?: number
  /** True when events were dropped (queue full or retries exhausted). */
  dropped?: boolean
}

export type ObservoClientOptions = {
  apiKey: string
  /**
   * API base including version prefix, e.g. `https://api.getobservo.com/api/v1`.
   * Required in production — there is no silent localhost default.
   */
  baseUrl: string
  /** Max events held before an automatic flush. Default: 20 */
  flushAt?: number
  /** Max ms between flushes. Default: 2000 */
  flushIntervalMs?: number
  /** Hard cap on queued events. Default: 1000 */
  maxQueueSize?: number
  /**
   * When the queue is full:
   * - `drop-oldest` (default): discard oldest events to make room
   * - `drop-newest`: reject new events
   */
  overflow?: 'drop-oldest' | 'drop-newest'
  /** HTTP timeout per attempt in ms. Default: 10_000 */
  timeoutMs?: number
  /** Max transport attempts per batch (including the first). Default: 3 */
  maxRetries?: number
  /** Base delay for exponential backoff in ms. Default: 250 */
  retryBaseDelayMs?: number
  /** Default app name attached to every event when omitted. */
  appName?: string
  /** Default environment attached to every event when omitted. */
  environment?: string
  /** Called for non-fatal SDK issues (failed flush, drops, etc.). */
  onError?: (error: unknown, context: ObservoErrorContext) => void
}

export type ObservoTransport = {
  send: (
    apiKey: string,
    body: { logs: Array<ObservoLogInput> },
    signal?: AbortSignal,
  ) => Promise<void>
}
