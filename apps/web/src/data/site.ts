export const site = {
  name: 'Observo',
  url: 'https://observo.dev',
  title: 'Observo — Developer-first observability platform',
  description:
    'Structured logs, traces, metrics, and alerts on a ClickHouse-powered engine. Search billions of events in milliseconds. Set up in under a minute.',
  ogImage: 'https://observo.dev/og.png',
  twitter: '@observodev',
} as const

export const navLinks = [
  { label: 'Why Observo', href: '#why' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#pipeline' },
  { label: 'Performance', href: '#performance' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const
