import type {
  Environment,
  LogEvent,
  LogImportance,
  LogLevel,
  LogSubsystem,
} from '#/data/dashboard/types'
import type { ApiLog } from '#/types/logs'

const LOG_LEVELS = new Set<LogLevel>([
  'info',
  'error',
  'warning',
  'debug',
  'trace',
  'audit',
  'success',
])

const IMPORTANCE_BY_RANK: Record<number, LogImportance> = {
  4: 'critical',
  3: 'high',
  2: 'medium',
  1: 'low',
}

const IMPORTANCE_LABELS = new Set<LogImportance>([
  'critical',
  'high',
  'medium',
  'low',
])

const SUBSYSTEMS = new Set<LogSubsystem>(['db', 'cache', 'queue', 'network'])

const ENVIRONMENTS = new Set<Environment>([
  'production',
  'staging',
  'development',
])

function parseJsonObject(value: string | null): Record<string, unknown> | null {
  if (!value) return null
  try {
    const parsed: unknown = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    return null
  }
  return null
}

function parseTimestamp(value: number | string): Date {
  if (typeof value === 'number') {
    // ClickHouse inserts unix seconds; accept ms defensively.
    return new Date(value > 2e12 ? value : value * 1000)
  }

  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && value.trim() !== '') {
    return new Date(asNumber > 2e12 ? asNumber : asNumber * 1000)
  }

  // ClickHouse DateTime strings are often `YYYY-MM-DD HH:MM:SS` (UTC-ish).
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(
    /Z$|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}Z`,
  )
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function formatTime(date: Date): string {
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  const ss = String(date.getUTCSeconds()).padStart(2, '0')
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function toLevel(type: string): LogLevel {
  return LOG_LEVELS.has(type as LogLevel) ? (type as LogLevel) : 'info'
}

function toImportance(
  value: number | string | null,
): LogImportance | undefined {
  if (value === null) return undefined
  if (typeof value === 'number') return IMPORTANCE_BY_RANK[value]
  const label = value.toLowerCase() as LogImportance
  return IMPORTANCE_LABELS.has(label) ? label : undefined
}

function toSubsystem(value: string | null): LogSubsystem | undefined {
  if (!value) return undefined
  return SUBSYSTEMS.has(value as LogSubsystem)
    ? (value as LogSubsystem)
    : undefined
}

function toEnvironment(value: string): Environment {
  return ENVIRONMENTS.has(value as Environment)
    ? (value as Environment)
    : 'production'
}

export function mapApiLogToEvent(log: ApiLog, index: number): LogEvent {
  const date = parseTimestamp(log.timestamp)
  const track = parseJsonObject(log.track)
  const security = parseJsonObject(log.security)
  const metrics = parseJsonObject(log.metrics)

  const latencyMs =
    typeof metrics?.latency_ms === 'number' ? metrics.latency_ms : undefined
  const dbQueryCount =
    typeof metrics?.db_query_count === 'number'
      ? metrics.db_query_count
      : undefined

  return {
    id: `${log.keyId}:${log.timestamp}:${index}`,
    time: formatTime(date),
    date: formatDate(date),
    level: toLevel(log.type),
    message: log.message,
    appName: log.appName || 'unknown',
    environment: toEnvironment(log.environment || 'production'),
    importance: toImportance(log.importance),
    subsystem: toSubsystem(log.subsystem),
    operation: log.operation ?? undefined,
    latencyMs,
    dbQueryCount,
    payload: {
      keyId: log.keyId,
      type: log.type,
      ...(log.service !== null ? { service: log.service } : {}),
      ...(track ? { track } : {}),
      ...(security ? { security } : {}),
      ...(metrics ? { metrics } : {}),
      ingestedAt: log.ingestedAt,
      timestamp: log.timestamp,
    },
  }
}

export function mapApiLogsToEvents(logs: Array<ApiLog>): Array<LogEvent> {
  return logs.map(mapApiLogToEvent)
}
