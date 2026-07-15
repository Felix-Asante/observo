import {
  ObservoClient,
  type ObservoClientOptions,
  type ObservoLogFields,
} from '@getobservo/core'

let singleton: ObservoClient | null = null
let hooksInstalled = false
let shuttingDown = false

function installProcessHooks(client: ObservoClient) {
  if (hooksInstalled) return
  hooksInstalled = true

  const shutdown = async () => {
    if (shuttingDown) return
    shuttingDown = true
    try {
      await client.close()
    } catch {
      // Errors already surfaced via onError.
    }
  }

  process.once('beforeExit', () => {
    void shutdown()
  })
  process.once('SIGINT', () => {
    void shutdown()
  })
  process.once('SIGTERM', () => {
    void shutdown()
  })
}

/**
 * Initialize the process-wide Observo client.
 * Call once at startup (e.g. `instrumentation.ts` or app bootstrap).
 *
 * `baseUrl` is required — e.g. `https://api.example.com/api/v1`.
 */
export function init(options: ObservoClientOptions): ObservoClient {
  singleton = new ObservoClient(options)
  installProcessHooks(singleton)
  return singleton
}

/** @deprecated Prefer `init`. Alias kept for earlier drafts. */
export const createLogger = init

/** Return the client from `init()`, or throw if not initialized. */
export function getClient(): ObservoClient {
  if (!singleton) {
    throw new Error(
      'Observo is not initialized. Call observo.init({ apiKey, baseUrl }) first.',
    )
  }
  return singleton
}

export function info(message: string, fields?: ObservoLogFields) {
  getClient().info(message, fields)
}

export function error(message: string, fields?: ObservoLogFields) {
  getClient().error(message, fields)
}

export function warning(message: string, fields?: ObservoLogFields) {
  getClient().warning(message, fields)
}

export function debug(message: string, fields?: ObservoLogFields) {
  getClient().debug(message, fields)
}

export function trace(message: string, fields?: ObservoLogFields) {
  getClient().trace(message, fields)
}

export function audit(message: string, fields?: ObservoLogFields) {
  getClient().audit(message, fields)
}

export function success(message: string, fields?: ObservoLogFields) {
  getClient().success(message, fields)
}

export function flush() {
  return getClient().flush()
}

/** Flush remaining events and stop accepting new ones. */
export function close() {
  return getClient().close()
}

export {
  ObservoClient,
  createFetchTransport,
  LOG_TYPES,
} from '@getobservo/core'

export type {
  LogImportance,
  LogSubsystem,
  LogType,
  ObservoClientOptions,
  ObservoErrorContext,
  ObservoLogFields,
  ObservoLogInput,
  ObservoTransport,
} from '@getobservo/core'

/** Convenience namespace mirroring docs: `observo.init(...)` / `observo.info(...)`. */
export const observo = {
  init,
  createLogger,
  getClient,
  info,
  error,
  warning,
  debug,
  trace,
  audit,
  success,
  flush,
  close,
}
