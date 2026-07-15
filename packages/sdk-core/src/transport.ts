import type { ObservoLogInput, ObservoTransport } from './types.js'

export function createFetchTransport(
  baseUrl: string,
  timeoutMs = 10_000,
): ObservoTransport {
  const normalized = baseUrl.replace(/\/$/, '')
  if (!normalized) {
    throw new Error('Observo transport requires a non-empty baseUrl')
  }

  return {
    async send(apiKey, body, signal) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      const onAbort = () => controller.abort()
      signal?.addEventListener('abort', onAbort, { once: true })

      try {
        const response = await fetch(`${normalized}/logs/send`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        if (!response.ok) {
          const text = await response.text().catch(() => '')
          const error = new Error(
            `Observo ingest failed (${response.status}): ${text || response.statusText}`,
          ) as Error & { status?: number; retryable?: boolean }
          error.status = response.status
          error.retryable = isRetryableStatus(response.status)
          throw error
        }
      } catch (error) {
        if (isAbortError(error)) {
          const abortError = new Error(
            `Observo ingest timed out after ${timeoutMs}ms`,
          ) as Error & { retryable?: boolean }
          abortError.retryable = true
          throw abortError
        }
        if (error instanceof Error) {
          const wrapped = error as Error & { retryable?: boolean }
          if (wrapped.retryable === undefined) {
            wrapped.retryable = true
          }
          throw wrapped
        }
        throw error
      } finally {
        clearTimeout(timeout)
        signal?.removeEventListener('abort', onAbort)
      }
    },
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  )
}

export type { ObservoLogInput }
