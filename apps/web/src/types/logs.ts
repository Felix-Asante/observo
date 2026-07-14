import type { LogLevel } from '#/data/dashboard/types'

export type ApiLog = {
  keyId: string
  userId: string
  type: string
  message: string
  appName: string
  environment: string
  importance: number | string | null
  subsystem: string | null
  service: string | number | null
  operation: string | null
  track: string | null
  security: string | null
  metrics: string | null
  /** Unix seconds or ClickHouse DateTime string */
  timestamp: number | string
  ingestedAt: number | string
}

export type GetLogsParams = {
  limit?: number
  search?: string
  type?: LogLevel
  env?: string
  appName?: string
  range?: string
}

export type GetLogsResponse = {
  logs: Array<ApiLog>
  count: number
  totalCount: number
  from?: number
  to?: number
  fallback?: boolean
  cached?: boolean
  ts?: number
}
