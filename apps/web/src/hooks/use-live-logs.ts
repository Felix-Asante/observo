import { useCallback, useEffect, useRef, useState, useEffectEvent } from 'react'
import { toQueryString } from '@observo/utils'

import { API_ENDPOINTS } from '#/constants/api-endpoint'
import { getApiBaseUrl } from '#/lib/api-url'
import { mapApiLogsToEvents } from '#/utils/logs/map-api-log'
import type { LogEvent } from '#/data/dashboard/types'
import type { ApiLog, GetLogsParams } from '#/types/logs'

export type LiveLogsStatus =
  'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error'

export type LiveLogsFilters = Pick<
  GetLogsParams,
  'type' | 'env' | 'appName' | 'search' | 'limit'
>

export type UseLiveLogsOptions = {
  /** When false, the stream is closed. Defaults to true. */
  enabled?: boolean
  /** Keep the socket open but hold events until resumed. */
  paused?: boolean
  filters?: LiveLogsFilters
  /** Cap in-memory events (newest retained). Defaults to 200. */
  maxEvents?: number
}

export type UseLiveLogsResult = {
  logs: Array<LogEvent>
  status: LiveLogsStatus
  error: string | null
  clear: () => void
}

type StreamEnvelope =
  | { type: 'initial'; logs: Array<ApiLog> }
  | { type: 'live'; logs: Array<ApiLog> }
  | { type: 'error'; message?: string }

const DEFAULT_MAX_EVENTS = 200
const MAX_BACKOFF_MS = 30_000
const BASE_BACKOFF_MS = 1_000

function buildStreamUrl(filters: LiveLogsFilters | undefined): string {
  const qs = toQueryString({
    limit: filters?.limit ?? 100,
    type: filters?.type,
    env: filters?.env,
    appName: filters?.appName,
    search: filters?.search?.trim() || undefined,
  })
  const base = getApiBaseUrl().replace(/\/$/, '')
  const path = API_ENDPOINTS.logs.stream()
  return qs ? `${base}${path}?${qs}` : `${base}${path}`
}

function prependLogs(
  current: Array<LogEvent>,
  incoming: Array<LogEvent>,
  maxEvents: number,
): Array<LogEvent> {
  if (incoming.length === 0) return current
  const seen = new Set(current.map((log) => log.id))
  const uniqueIncoming = incoming.filter((log) => {
    if (seen.has(log.id)) return false
    seen.add(log.id)
    return true
  })
  if (uniqueIncoming.length === 0) return current
  return [...uniqueIncoming, ...current].slice(0, maxEvents)
}

export function useLiveLogs(
  options: UseLiveLogsOptions = {},
): UseLiveLogsResult {
  const {
    enabled = true,
    paused = false,
    filters,
    maxEvents = DEFAULT_MAX_EVENTS,
  } = options

  const [logs, setLogs] = useState<Array<LogEvent>>([])
  const [status, setStatus] = useState<LiveLogsStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const pausedRef = useRef(paused)
  const backoffRef = useRef(BASE_BACKOFF_MS)
  const bufferRef = useRef<Array<LogEvent>>([])
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generationRef = useRef(0)

  // Keep paused flag fresh without reconnecting.
  // flush buffered logs into the logs state
  useEffect(() => {
    pausedRef.current = paused
    if (!paused && bufferRef.current.length > 0) {
      const buffered = bufferRef.current
      bufferRef.current = []
      setLogs((current) => prependLogs(current, buffered, maxEvents))
    }
  }, [paused, maxEvents])

  const clear = useCallback(() => {
    bufferRef.current = []
    setLogs([])
  }, [])

  const ingest = useEffectEvent((incoming: Array<ApiLog>, replace: boolean) => {
    const mapped = mapApiLogsToEvents(incoming)
    if (mapped.length === 0 && !replace) return

    if (pausedRef.current && !replace) {
      // buffer the incoming logs until the stream is resumed
      bufferRef.current = prependLogs(bufferRef.current, mapped, maxEvents)
      return
    }

    if (replace) {
      setLogs(mapped.slice(0, maxEvents))
      bufferRef.current = []
      return
    }

    setLogs((current) => prependLogs(current, mapped, maxEvents))
  })

  const disconnect = useEffectEvent(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  })

  const connect = useEffectEvent((generation: number, isRetry: boolean) => {
    disconnect()

    if (!enabled) {
      setStatus('idle')
      return
    }

    setStatus(isRetry ? 'reconnecting' : 'connecting')
    setError(null)

    const url = buildStreamUrl(filters)
    const source = new EventSource(url, { withCredentials: true })
    eventSourceRef.current = source

    source.onopen = () => {
      if (generation !== generationRef.current) return
      backoffRef.current = BASE_BACKOFF_MS
      setStatus('connected')
      setError(null)
    }

    source.onmessage = (event) => {
      if (generation !== generationRef.current) return
      if (!event.data) return

      let payload: StreamEnvelope
      try {
        payload = JSON.parse(event.data) as StreamEnvelope
      } catch {
        return
      }

      if (payload.type === 'error') {
        setError(payload.message || 'Stream error')
        setStatus('error')
        return
      }

      if (payload.type === 'initial') {
        ingest(payload.logs, true)
        setStatus('connected')
        return
      }

      ingest(payload.logs, false)
    }

    source.onerror = () => {
      if (generation !== generationRef.current) return

      source.close()
      if (eventSourceRef.current === source) {
        eventSourceRef.current = null
      }

      setStatus('reconnecting')
      setError('Connection lost. Reconnecting…')

      const delay = backoffRef.current
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS)

      reconnectTimerRef.current = setTimeout(() => {
        if (generation !== generationRef.current) return
        connect(generation, true)
      }, delay)
    }
  })

  useEffect(() => {
    const generation = ++generationRef.current
    backoffRef.current = BASE_BACKOFF_MS
    connect(generation, false)

    return () => {
      generationRef.current += 1
      disconnect()
    }
  }, [
    enabled,
    filters?.limit,
    filters?.type,
    filters?.env,
    filters?.appName,
    filters?.search,
  ])

  return { logs, status, error, clear }
}
