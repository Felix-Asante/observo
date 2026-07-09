import type { ActivityItem } from './types'

export const overviewMetrics = [
  {
    id: 'logs',
    label: 'Events (24h)',
    value: '1.28M',
    delta: '+12.4%',
    deltaTone: 'positive',
    spark: [24, 30, 28, 36, 42, 38, 44, 52, 47, 58, 63, 60],
  },
  {
    id: 'error-rate',
    label: 'Error rate',
    value: '0.42%',
    delta: '-0.08%',
    deltaTone: 'positive',
    spark: [8, 7, 9, 6, 7, 5, 6, 5, 4, 5, 4, 4],
  },
  {
    id: 'latency',
    label: 'p95 ingest latency',
    value: '184ms',
    delta: '+6ms',
    deltaTone: 'negative',
    spark: [30, 32, 31, 34, 33, 36, 35, 38, 37, 39, 41, 40],
  },
  {
    id: 'keys',
    label: 'Active API keys',
    value: '4 / 10',
    delta: '2 used today',
    deltaTone: 'neutral',
    spark: [2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
  },
] as const

export type OverviewMetric = (typeof overviewMetrics)[number]

/** Hourly event volume, last 24h. */
export const volumeSeries = [
  42, 38, 31, 26, 22, 20, 24, 35, 52, 68, 79, 84, 88, 92, 86, 90, 97, 104, 96,
  88, 76, 64, 58, 51,
] as const

/** Errors per service, last 24h. */
export const errorsByService = [
  { name: 'payments', count: 128 },
  { name: 'web', count: 64 },
  { name: 'api', count: 41 },
  { name: 'workers', count: 22 },
  { name: 'auth', count: 9 },
  { name: 'search', count: 4 },
] as const

export const topApps = [
  {
    name: 'api',
    environment: 'production',
    events: '612k',
    errors: 41,
    p95: '92ms',
    trend: [40, 44, 42, 50, 48, 55, 52, 58, 61, 57, 63, 66],
  },
  {
    name: 'payments',
    environment: 'production',
    events: '284k',
    errors: 128,
    p95: '212ms',
    trend: [30, 28, 34, 31, 38, 36, 42, 39, 45, 48, 44, 50],
  },
  {
    name: 'workers',
    environment: 'production',
    events: '198k',
    errors: 22,
    p95: '64ms',
    trend: [22, 25, 23, 28, 26, 30, 29, 33, 31, 35, 34, 38],
  },
  {
    name: 'auth',
    environment: 'production',
    events: '121k',
    errors: 9,
    p95: '38ms',
    trend: [18, 17, 19, 18, 20, 19, 22, 21, 23, 22, 24, 25],
  },
  {
    name: 'web',
    environment: 'production',
    events: '86k',
    errors: 64,
    p95: '148ms',
    trend: [12, 14, 13, 16, 15, 18, 17, 20, 22, 19, 24, 26],
  },
] as const

export const systemStatus = [
  { name: 'Ingest API', status: 'operational', detail: '184ms p95' },
  { name: 'Query engine', status: 'operational', detail: '38ms p99' },
  { name: 'Live stream', status: 'operational', detail: '112 clients' },
  { name: 'Webhooks', status: 'degraded', detail: 'retries elevated' },
] as const

export const recentActivity: Array<ActivityItem> = [
  {
    id: 'act_1',
    kind: 'alert',
    text: 'Alert "High error rate" triggered on payments',
    detail: 'error rate 1.4% > 1% for 5m',
    time: '12m ago',
  },
  {
    id: 'act_2',
    kind: 'deploy',
    text: 'Deploy 4e12af9 rolled out to production',
    detail: 'api · 6 instances · 84s',
    time: '38m ago',
  },
  {
    id: 'act_3',
    kind: 'api-key',
    text: 'API key OBV:4fa2… regenerated',
    detail: 'by maya@arcline.dev',
    time: '1h ago',
  },
  {
    id: 'act_4',
    kind: 'quota',
    text: 'Monthly ingest at 74% of plan quota',
    detail: '7,482 of 10,000 logs',
    time: '3h ago',
  },
  {
    id: 'act_5',
    kind: 'member',
    text: 'dev@arcline.dev enabled webhook notifications',
    time: '5h ago',
  },
]
