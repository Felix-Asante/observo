import type { OverviewMetrics } from '#/types/overview'

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000)
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`
  return String(Math.round(value))
}

function formatSigned(value: number, digits = 1, suffix = '%'): string {
  const rounded = value.toFixed(digits)
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${rounded}${suffix}`
}

export function formatOverviewDescription(events24h: number): string {
  if (events24h <= 0) {
    return 'No events ingested in the last 24 hours yet.'
  }
  return `${formatCompact(events24h)} events ingested in the last 24 hours.`
}

export function buildOverviewMetricCards(metrics: OverviewMetrics) {
  const eventsDelta =
    metrics.eventsDeltaPercent === null
      ? { delta: 'vs prior 24h', deltaTone: 'neutral' as const }
      : {
          delta: formatSigned(metrics.eventsDeltaPercent),
          deltaTone:
            metrics.eventsDeltaPercent >= 0
              ? ('positive' as const)
              : ('negative' as const),
        }

  const errorDelta =
    metrics.errorRateDelta === null
      ? { delta: 'vs prior 24h', deltaTone: 'neutral' as const }
      : {
          delta: formatSigned(metrics.errorRateDelta, 2),
          // Lower error rate is positive.
          deltaTone:
            metrics.errorRateDelta <= 0
              ? ('positive' as const)
              : ('negative' as const),
        }

  return [
    {
      id: 'logs',
      label: 'Events (24h)',
      value: formatCompact(metrics.events24h),
      spark: metrics.eventsSpark,
      ...eventsDelta,
    },
    {
      id: 'error-rate',
      label: 'Error rate',
      value: `${metrics.errorRate.toFixed(2)}%`,
      spark: metrics.errorRateSpark,
      ...errorDelta,
    },
    {
      id: 'latency',
      label: 'p95 ingest latency',
      value:
        metrics.ingestLatencyP95Ms === null
          ? '—'
          : `${Math.round(metrics.ingestLatencyP95Ms)}ms`,
      delta:
        metrics.ingestLatencyP95Ms === null
          ? 'no samples yet'
          : 'from recent ingest',
      deltaTone: 'neutral' as const,
      spark: metrics.latencySpark,
    },
    {
      id: 'keys',
      label: 'Active API keys',
      value: `${metrics.activeApiKeys} / ${metrics.maxApiKeys}`,
      delta: `${metrics.keysUsedToday} used today`,
      deltaTone: 'neutral' as const,
      spark: Array.from({ length: 12 }, (_, index) =>
        index < metrics.activeApiKeys ? metrics.activeApiKeys : 0,
      ),
    },
  ]
}
