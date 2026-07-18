import { stats } from './stats'

export const trustedBy = [
  'Arcline',
  'Nimbus Labs',
  'Fathom',
  'Basalt',
  'Meridian',
  'Coreloop',
  'Vexel',
  'Statler & Co',
] as const

export const metrics = [
  {
    value: 2,
    suffix: 'M+',
    decimals: 0,
    label: 'logs/min ingest capacity',
    detail: 'Built to keep up with busy apps.',
  },
  {
    value: stats.searchP99Ms,
    suffix: 'ms',
    decimals: 0,
    label: 'p99 search latency',
    detail: 'Find what you need instantly.',
  },
  {
    value: stats.setupSeconds,
    prefix: '<',
    suffix: 's',
    decimals: 0,
    label: 'from install to first log',
    detail: 'One snippet, deploy, done.',
  },
  {
    value: 0,
    suffix: '',
    decimals: 0,
    label: 'config files needed',
    detail: 'No YAML, no servers, no tuning.',
  },
] as const

export const whyParagraphs = [
  'Most teams don\u2019t have time to babysit an observability stack. ELK clusters, random dashboards, YAML jungles \u2014 all just to answer one question: what went wrong?',
  'Whether you\u2019re shipping a side project or running a platform team, you don\u2019t want to spend days wiring logs. You just want errors, requests, and latency in one place, instantly.',
  'Observo removes the overhead. Drop in a small SDK, deploy, and your logs start streaming in under a minute. No servers. No cluster tuning. No 40-page docs before anything works.',
] as const

export const comparison = {
  without: [
    'Too many dashboards to keep in sync.',
    'Hard to set up and easy to break.',
    'Slow searches when you\u2019re under pressure.',
    'YAML everywhere and confusing config files.',
    'Paying for storage and infra you barely use.',
  ],
  with: [
    'Set up in under a minute with a tiny SDK.',
    'Search that feels as fast as your editor.',
    'Live tail streaming straight into your dashboard.',
    'Webhook alerts before users notice anything.',
    'Pricing that grows with your app, not your stress.',
  ],
} as const

export const features = [
  {
    id: 'structured-logging',
    title: 'Capture & store instantly',
    description:
      'Send JSON logs from your app, API, or background jobs \u2014 no schemas, no migrations. Every field is indexed automatically so you can focus on shipping.',
    visual: 'logs',
    span: 'wide',
  },
  {
    id: 'search',
    title: 'Search & debug live',
    description:
      'Find bugs in seconds with filters like status:500. ClickHouse under the hood means answers in milliseconds, even when you\u2019re under pressure.',
    visual: 'search',
    span: 'normal',
  },
  {
    id: 'live-tail',
    title: 'Live log stream',
    description:
      'Watch events stream in real time with live tail \u2014 or pipe the same stream into your own app and build custom dashboard views.',
    visual: 'stream',
    span: 'normal',
  },
  {
    id: 'tracing',
    title: 'Distributed tracing',
    description:
      'Go from issue to context to fix. Every span is connected to its logs and errors by the same trace ID, so the full story is always one click away.',
    visual: 'trace',
    span: 'wide',
  },
  {
    id: 'error-tracking',
    title: 'Error tracking',
    description:
      'Similar errors are grouped into issues with the release, environment, and the exact log lines around the failure \u2014 root-cause instead of guess.',
    visual: 'errors',
    span: 'normal',
  },
  {
    id: 'alerting',
    title: 'Smart alerts & webhooks',
    description:
      'Never miss a critical error. Set thresholds on any query and get instant notifications in Slack or via webhook.',
    visual: 'alerts',
    span: 'normal',
  },
] as const

export type Feature = (typeof features)[number]

export const pipelineStages = [
  { id: 'sdk', label: 'SDK', sub: 'Node, Python, Go +' },
  { id: 'ingest', label: 'Ingest API', sub: 'Batched, validated' },
  { id: 'nats', label: 'NATS JetStream', sub: 'Durable queue' },
  { id: 'clickhouse', label: 'ClickHouse', sub: 'Columnar storage' },
  { id: 'dashboard', label: 'Dashboard', sub: 'Live in <200ms' },
] as const

export const testimonials = [
  {
    quote:
      'Setup was insanely fast. I dropped in the SDK and real logs were streaming before my coffee got cold.',
    name: 'Maya Lindqvist',
    handle: '@maya_ships',
  },
  {
    quote:
      'Launch day: 3k signups and a checkout bug at 9am. Live tail pointed at the bad deploy in four minutes. Observo paid for itself before lunch.',
    name: 'Dev Okafor',
    handle: '@dev_builds',
  },
  {
    quote:
      'The trace waterfall connected a payment timeout to a slow query in a service we\u2019d forgotten existed. That one fix paid for a year of Observo.',
    name: 'Sofia Reyes',
    handle: '@sofiareyes_io',
  },
  {
    quote:
      'The search speed is unreal \u2014 faster than grep on my laptop. I\u2019ve stopped SSH-ing into boxes entirely.',
    name: 'Jonas Weber',
    handle: '@jwbr_dev',
  },
  {
    quote:
      'We moved about a billion events a day off self-hosted ELK. Queries went from 20 seconds to under 40ms and the bill dropped by 60%.',
    name: 'Priya Raman',
    handle: '@priya_ops',
  },
  {
    quote:
      'Pricing is super transparent. No hidden fees, no surprise bills at the end of the month.',
    name: 'Tom Eriksen',
    handle: '@tomeriksen',
  },
] as const

export const faqs = [
  {
    question: 'How long does setup actually take?',
    answer:
      'Under a minute for most stacks. Install the SDK, set your API key, and logs start streaming. No agents, no sidecars, no config files \u2014 the SDK batches and ships events over HTTPS.',
  },
  {
    question: 'What makes the search so fast?',
    answer: `Every event lands in ClickHouse, a columnar database built for analytical queries over billions of rows. Combined with our indexing strategy, p99 search latency stays around ${stats.searchP99Ms}ms even at massive scale.`,
  },
  {
    question: 'How is Observo different from Datadog or Sentry?',
    answer:
      'Focus. Datadog bills per host and per feature; Sentry centers on error tracking. Observo puts logs, traces, and alerts on one ClickHouse engine with volume-based pricing \u2014 the 90% of observability you actually use, at a price a side project can afford and a platform team can defend.',
  },
  {
    question: 'Can I stream logs into my own product?',
    answer:
      'Yes. The same SSE endpoint that powers our live tail is available in the SDK, so you can embed real-time log streams directly into your own dashboards.',
  },
  {
    question: 'Which languages and frameworks are supported?',
    answer:
      'First-party SDKs for Node.js, Next.js, Python, and Go, with more on the way. Anything that can send JSON over HTTPS can use the ingest API directly.',
  },
  {
    question: 'How does pricing scale? What if I outgrow Pro?',
    answer:
      'By event volume, not seats. Every plan includes unlimited team members, all features, and predictable overage pricing \u2014 no surprise bills at the end of the month. Past Pro, the Scale plan adds custom volume, longer retention, SSO, audit logs, and dedicated regions.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Data is encrypted in transit and at rest, isolated per project, and stored in your chosen region. API keys are scoped per environment and rotate without downtime.',
  },
] as const

/** Demo rows shaped like dashboard `LogEvent`s for the marketing hero. */
export const heroLogLines = [
  {
    time: '14:32:01.284',
    level: 'info',
    service: 'api',
    message: 'POST /v1/checkout 201 · 42ms',
  },
  {
    time: '14:32:01.612',
    level: 'debug',
    service: 'cache',
    message: 'hit user:usr_8f2 profile',
  },
  {
    time: '14:32:02.033',
    level: 'info',
    service: 'payments',
    message: 'invoice.paid → webhook queued',
  },
  {
    time: '14:32:02.418',
    level: 'warn',
    service: 'workers',
    message: 'retry queue depth 12 (threshold 50)',
  },
  {
    time: '14:32:02.902',
    level: 'info',
    service: 'api',
    message: 'GET /v1/orders 200 · 8ms',
  },
  {
    time: '14:32:03.155',
    level: 'error',
    service: 'payments',
    message: 'stripe timeout after 5000ms · trace 4fa2',
  },
  {
    time: '14:32:03.514',
    level: 'info',
    service: 'api',
    message: 'GET /v1/health 200 · 1ms',
  },
  {
    time: '14:32:03.987',
    level: 'info',
    service: 'auth',
    message: 'session issued for usr_2c41',
  },
] as const

export type HeroLogLine = (typeof heroLogLines)[number]
