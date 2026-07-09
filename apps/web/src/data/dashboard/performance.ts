/** Latency percentiles over time (ms), last 24h hourly. */
export const latencySeries = {
  p50: [
    12, 11, 10, 11, 12, 14, 18, 22, 28, 32, 38, 42, 44, 46, 48, 45, 42, 38, 34,
    30, 26, 22, 18, 16,
  ],
  p95: [
    48, 46, 44, 46, 52, 58, 72, 88, 104, 118, 132, 148, 156, 162, 168, 158, 142,
    128, 112, 96, 82, 68, 58, 52,
  ],
  p99: [
    92, 88, 84, 86, 98, 112, 138, 168, 198, 224, 248, 272, 284, 296, 308, 288,
    256, 228, 198, 168, 142, 118, 98, 88,
  ],
} as const

export const endpointLatency = [
  {
    endpoint: 'POST /v1/checkout',
    p50: 42,
    p95: 128,
    p99: 284,
    requests: '84k',
  },
  { endpoint: 'GET /v1/orders', p50: 8, p95: 24, p99: 48, requests: '612k' },
  {
    endpoint: 'POST /v1/auth/login',
    p50: 18,
    p95: 52,
    p99: 96,
    requests: '121k',
  },
  { endpoint: 'GET /v1/health', p50: 1, p95: 3, p99: 8, requests: '1.2M' },
  {
    endpoint: 'POST /v1/webhooks/stripe',
    p50: 64,
    p95: 212,
    p99: 5004,
    requests: '28k',
  },
] as const

export const performanceMetrics = [
  {
    id: 'p50',
    label: 'p50 latency',
    value: '16ms',
    delta: '-2ms vs yesterday',
    deltaTone: 'positive' as const,
    spark: latencySeries.p50,
  },
  {
    id: 'p95',
    label: 'p95 latency',
    value: '148ms',
    delta: '+12ms vs yesterday',
    deltaTone: 'negative' as const,
    spark: latencySeries.p95,
  },
  {
    id: 'p99',
    label: 'p99 latency',
    value: '284ms',
    delta: '+18ms vs yesterday',
    deltaTone: 'negative' as const,
    spark: latencySeries.p99,
  },
  {
    id: 'throughput',
    label: 'Requests / min',
    value: '842',
    delta: '+6.2% vs yesterday',
    deltaTone: 'positive' as const,
    spark: [620, 640, 680, 720, 760, 800, 820, 840, 850, 842, 838, 845],
  },
] as const
