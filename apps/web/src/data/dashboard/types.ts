/**
 * Types mirroring the Observo API (apps/api) so every page is ready
 * to plug into the real endpoints later.
 */

/** Matches the `type` enum on `AddLogDto` / ClickHouse `logs.events.type`. */
export type LogLevel =
  'info' | 'error' | 'warning' | 'debug' | 'trace' | 'audit' | 'success'

/** Matches `importance` on `AddLogDto`. */
export type LogImportance = 'critical' | 'high' | 'medium' | 'low'

/** Matches `subsystem` on `AddLogDto`. */
export type LogSubsystem = 'db' | 'cache' | 'queue' | 'network'

export type Environment = 'production' | 'staging' | 'development'

/** Shape of a ClickHouse `logs.events` row as consumed by the UI. */
export type LogEvent = {
  id: string
  /** Pre-formatted for deterministic SSR (e.g. "13:42:01.284"). */
  time: string
  /** Pre-formatted date label (e.g. "Jul 9"). */
  date: string
  level: LogLevel
  message: string
  appName: string
  environment: Environment
  importance?: LogImportance
  subsystem?: LogSubsystem
  operation?: string
  latencyMs?: number
  dbQueryCount?: number
  traceId?: string
  /** Parsed `track` / `security` / raw payload for the JSON viewer. */
  payload: Record<string, unknown>
}

/** Matches `GET /api/v1/api-keys` list item shape. */
export type ApiKey = {
  id: string
  prefix: string
  createdAt: string
  lastUsedAt: string
  revokedAt: string | null
}

export type AlertRule = {
  id: string
  name: string
  query: string
  condition: string
  channels: Array<'slack' | 'webhook' | 'email'>
  severity: LogImportance
  enabled: boolean
  lastTriggered: string | null
}

export type ErrorIssue = {
  id: string
  message: string
  appName: string
  environment: Environment
  importance: LogImportance
  count24h: number
  trend: Array<number>
  firstSeen: string
  lastSeen: string
}

export type ActivityItem = {
  id: string
  kind: 'api-key' | 'alert' | 'deploy' | 'quota' | 'member'
  text: string
  detail?: string
  time: string
}
