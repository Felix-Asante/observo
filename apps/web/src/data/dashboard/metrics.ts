export const metricDefinitions = [
  {
    id: 'ingest_rate',
    name: 'ingest.rate',
    unit: 'events/min',
    value: '842',
    trend: [620, 640, 680, 720, 760, 800, 820, 840, 850, 842, 838, 845],
    description: 'Events received per minute across all keys',
  },
  {
    id: 'error_rate',
    name: 'error.rate',
    unit: '%',
    value: '0.42',
    trend: [0.8, 0.7, 0.6, 0.5, 0.48, 0.45, 0.44, 0.43, 0.42, 0.41, 0.42, 0.42],
    description: 'Percentage of error-level events in the last hour',
  },
  {
    id: 'ingest_latency',
    name: 'ingest.latency_p95',
    unit: 'ms',
    value: '184',
    trend: [120, 130, 140, 150, 160, 168, 172, 178, 182, 184, 186, 184],
    description: 'p95 time from SDK send to ClickHouse ack',
  },
  {
    id: 'query_latency',
    name: 'query.latency_p99',
    unit: 'ms',
    value: '38',
    trend: [42, 40, 38, 36, 38, 40, 38, 36, 38, 38, 36, 38],
    description: 'p99 search query latency on ClickHouse',
  },
  {
    id: 'active_keys',
    name: 'api_keys.active',
    unit: 'keys',
    value: '4',
    trend: [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
    description: 'Non-revoked API keys with activity in 24h',
  },
  {
    id: 'storage',
    name: 'storage.compressed',
    unit: 'MB',
    value: '128',
    trend: [80, 88, 96, 104, 112, 118, 122, 125, 127, 128, 128, 128],
    description: 'Compressed event storage this billing cycle',
  },
] as const

export const metricSeries = [
  42, 38, 31, 26, 22, 20, 24, 35, 52, 68, 79, 84, 88, 92, 86, 90, 97, 104, 96,
  88, 76, 64, 58, 51,
] as const
