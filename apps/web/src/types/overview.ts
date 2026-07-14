export type OverviewSystemStatus = {
  name: string
  status: 'operational' | 'degraded'
  detail: string
}

export type OverviewMetrics = {
  events24h: number
  eventsDeltaPercent: number | null
  errorRate: number
  errorRateDelta: number | null
  ingestLatencyP95Ms: number | null
  activeApiKeys: number
  maxApiKeys: number
  keysUsedToday: number
  eventsSpark: Array<number>
  errorRateSpark: Array<number>
  latencySpark: Array<number>
}

export type OverviewResponse = {
  generatedAt: string
  metrics: OverviewMetrics
  volumeSeries: Array<number>
  systemStatus: Array<OverviewSystemStatus>
}
