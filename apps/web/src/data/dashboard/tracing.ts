export type TraceSpan = {
  id: string
  name: string
  service: string
  startMs: number
  durationMs: number
  status: 'ok' | 'error' | 'timeout'
  children?: Array<TraceSpan>
}

export const recentTraces = [
  {
    id: '4fa2c81b',
    operation: 'POST /v1/checkout',
    service: 'api',
    durationMs: 284,
    status: 'error' as const,
    spans: 12,
    time: '13:42:01',
  },
  {
    id: '8b3d2e91',
    operation: 'GET /v1/orders',
    service: 'api',
    durationMs: 8,
    status: 'ok' as const,
    spans: 4,
    time: '13:41:58',
  },
  {
    id: 'c7a1f004',
    operation: 'stripe.charge',
    service: 'payments',
    durationMs: 5004,
    status: 'timeout' as const,
    spans: 8,
    time: '13:41:55',
  },
  {
    id: '2e9b5c33',
    operation: 'auth.verify',
    service: 'auth',
    durationMs: 18,
    status: 'ok' as const,
    spans: 3,
    time: '13:41:52',
  },
] as const

/** Waterfall for trace 4fa2c81b — checkout flow with stripe timeout. */
export const sampleTrace: TraceSpan = {
  id: 'root',
  name: 'POST /v1/checkout',
  service: 'api',
  startMs: 0,
  durationMs: 284,
  status: 'error',
  children: [
    {
      id: 's1',
      name: 'auth.verify',
      service: 'auth',
      startMs: 2,
      durationMs: 18,
      status: 'ok',
    },
    {
      id: 's2',
      name: 'db.query',
      service: 'api',
      startMs: 24,
      durationMs: 12,
      status: 'ok',
    },
    {
      id: 's3',
      name: 'cache.get',
      service: 'api',
      startMs: 40,
      durationMs: 4,
      status: 'ok',
    },
    {
      id: 's4',
      name: 'stripe.charge',
      service: 'payments',
      startMs: 52,
      durationMs: 228,
      status: 'timeout',
      children: [
        {
          id: 's4a',
          name: 'stripe.api.request',
          service: 'payments',
          startMs: 56,
          durationMs: 5000,
          status: 'timeout',
        },
      ],
    },
  ],
}
