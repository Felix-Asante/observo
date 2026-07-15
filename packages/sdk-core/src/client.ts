import { createFetchTransport } from './transport.js'
import type {
  LogType,
  ObservoClientOptions,
  ObservoErrorContext,
  ObservoLogFields,
  ObservoLogInput,
  ObservoTransport,
} from './types.js'

const DEFAULTS = {
  flushAt: 20,
  flushIntervalMs: 2_000,
  maxQueueSize: 1_000,
  overflow: 'drop-oldest' as const,
  timeoutMs: 10_000,
  maxRetries: 3,
  retryBaseDelayMs: 250,
}

export class ObservoClient {
  private readonly apiKey: string
  private readonly transport: ObservoTransport
  private readonly flushAt: number
  private readonly flushIntervalMs: number
  private readonly maxQueueSize: number
  private readonly overflow: 'drop-oldest' | 'drop-newest'
  private readonly maxRetries: number
  private readonly retryBaseDelayMs: number
  private readonly appName?: string
  private readonly environment?: string
  private readonly onError?: ObservoClientOptions['onError']
  private queue: Array<ObservoLogInput> = []
  private timer: ReturnType<typeof setTimeout> | null = null
  private flushing: Promise<void> | null = null
  private closed = false
  private droppedCount = 0

  constructor(options: ObservoClientOptions, transport?: ObservoTransport) {
    if (!options.apiKey?.trim()) {
      throw new Error('ObservoClient requires an apiKey')
    }
    if (!options.baseUrl?.trim()) {
      throw new Error(
        'ObservoClient requires baseUrl (e.g. https://api.example.com/api/v1)',
      )
    }

    this.apiKey = options.apiKey
    this.flushAt = options.flushAt ?? DEFAULTS.flushAt
    this.flushIntervalMs = options.flushIntervalMs ?? DEFAULTS.flushIntervalMs
    this.maxQueueSize = options.maxQueueSize ?? DEFAULTS.maxQueueSize
    this.overflow = options.overflow ?? DEFAULTS.overflow
    this.maxRetries = Math.max(1, options.maxRetries ?? DEFAULTS.maxRetries)
    this.retryBaseDelayMs =
      options.retryBaseDelayMs ?? DEFAULTS.retryBaseDelayMs
    this.appName = options.appName
    this.environment = options.environment
    this.onError = options.onError
    this.transport =
      transport ??
      createFetchTransport(
        options.baseUrl,
        options.timeoutMs ?? DEFAULTS.timeoutMs,
      )
  }

  info(message: string, fields?: ObservoLogFields) {
    this.log('info', message, fields)
  }

  error(message: string, fields?: ObservoLogFields) {
    this.log('error', message, fields)
  }

  warning(message: string, fields?: ObservoLogFields) {
    this.log('warning', message, fields)
  }

  debug(message: string, fields?: ObservoLogFields) {
    this.log('debug', message, fields)
  }

  trace(message: string, fields?: ObservoLogFields) {
    this.log('trace', message, fields)
  }

  audit(message: string, fields?: ObservoLogFields) {
    this.log('audit', message, fields)
  }

  success(message: string, fields?: ObservoLogFields) {
    this.log('success', message, fields)
  }

  log(type: LogType, message: string, fields?: ObservoLogFields) {
    this.enqueue({
      ...fields,
      type,
      message,
      app_name: fields?.app_name ?? this.appName,
      environment: fields?.environment ?? this.environment,
    })
  }

  /** Enqueue raw events (useful for wrappers / Next instrumentation). */
  capture(events: ObservoLogInput | Array<ObservoLogInput>) {
    const list = Array.isArray(events) ? events : [events]
    for (const event of list) {
      this.enqueue({
        ...event,
        type: event.type ?? 'info',
        app_name: event.app_name ?? this.appName,
        environment: event.environment ?? this.environment,
      })
    }
  }

  /** Number of events currently waiting to flush. */
  get pendingCount() {
    return this.queue.length
  }

  /** Cumulative events dropped due to overflow or failed retries. */
  get dropped() {
    return this.droppedCount
  }

  async flush(): Promise<void> {
    if (this.flushing) return this.flushing
    if (this.queue.length === 0) return

    const batch = this.queue
    this.queue = []
    this.clearTimer()

    this.flushing = this.sendWithRetry(batch)
      .catch((error) => {
        this.droppedCount += batch.length
        this.reportError(error, {
          phase: 'flush',
          batchSize: batch.length,
          dropped: true,
        })
        throw error
      })
      .finally(() => {
        this.flushing = null
        if (this.queue.length >= this.flushAt) {
          void this.flush().catch(() => undefined)
        } else if (this.queue.length > 0) {
          this.scheduleFlush()
        }
      })

    return this.flushing
  }

  /**
   * Flush remaining events and stop accepting new ones.
   * Await this on graceful shutdown.
   */
  async close(): Promise<void> {
    this.closed = true
    this.clearTimer()
    await this.flush()
  }

  private async sendWithRetry(batch: Array<ObservoLogInput>): Promise<void> {
    let lastError: unknown

    for (let attempt = 1; attempt <= this.maxRetries; attempt += 1) {
      try {
        await this.transport.send(this.apiKey, { logs: batch })
        return
      } catch (error) {
        lastError = error
        const retryable = isRetryable(error)
        if (!retryable || attempt >= this.maxRetries) {
          this.reportError(error, {
            phase: 'flush',
            batchSize: batch.length,
            attempt,
          })
          break
        }

        this.reportError(error, {
          phase: 'flush',
          batchSize: batch.length,
          attempt,
        })
        await sleep(backoffDelay(this.retryBaseDelayMs, attempt))
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('Observo flush failed')
  }

  private enqueue(event: ObservoLogInput) {
    if (this.closed) {
      this.droppedCount += 1
      this.reportError(new Error('ObservoClient is closed'), {
        phase: 'enqueue',
        dropped: true,
        batchSize: 1,
      })
      return
    }

    if (!event.message?.trim()) {
      this.reportError(new Error('Observo log message is required'), {
        phase: 'enqueue',
        dropped: true,
        batchSize: 1,
      })
      return
    }

    if (this.queue.length >= this.maxQueueSize) {
      if (this.overflow === 'drop-newest') {
        this.droppedCount += 1
        this.reportError(new Error('Observo queue full; dropping newest event'), {
          phase: 'enqueue',
          dropped: true,
          batchSize: 1,
        })
        return
      }

      this.queue.shift()
      this.droppedCount += 1
      this.reportError(new Error('Observo queue full; dropping oldest event'), {
        phase: 'enqueue',
        dropped: true,
        batchSize: 1,
      })
    }

    this.queue.push(event)

    if (this.queue.length >= this.flushAt) {
      void this.flush().catch(() => undefined)
      return
    }

    this.scheduleFlush()
  }

  private scheduleFlush() {
    if (this.timer || this.closed) return
    this.timer = setTimeout(() => {
      this.timer = null
      void this.flush().catch(() => undefined)
    }, this.flushIntervalMs)

    // Don't keep the event loop alive solely for an idle flush timer.
    unrefTimer(this.timer)
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private reportError(error: unknown, context: ObservoErrorContext) {
    try {
      this.onError?.(error, context)
    } catch {
      // Never let user onError break the SDK.
    }
  }
}

function isRetryable(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'retryable' in error) {
    return Boolean((error as { retryable?: boolean }).retryable)
  }
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: number }).status
    return status === 408 || status === 429 || (typeof status === 'number' && status >= 500)
  }
  return true
}

function backoffDelay(baseMs: number, attempt: number): number {
  const exp = baseMs * 2 ** (attempt - 1)
  const jitter = Math.floor(Math.random() * baseMs)
  return exp + jitter
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function unrefTimer(timer: ReturnType<typeof setTimeout>) {
  if (typeof timer === 'object' && timer !== null && 'unref' in timer) {
    ;(timer as { unref: () => void }).unref()
  }
}
