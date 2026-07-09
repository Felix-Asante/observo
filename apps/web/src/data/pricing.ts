export type PricingPlan = {
  name: string
  price: string
  period: string
  description: string
  features: Array<string>
  cta: string
  highlighted?: boolean
  badge?: string
}

export const pricingPlans: Array<PricingPlan> = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Good for side projects and experiments.',
    features: [
      '10k logs / month',
      '7-day retention',
      'Advanced search',
      'Live tail',
      'Webhook alerts',
      'API access',
    ],
    cta: 'Start free',
  },
  {
    name: 'Starter',
    price: '$9.99',
    period: '/mo',
    description: 'Affordable logging for small SaaS teams.',
    features: [
      '100k logs / month',
      '30-day retention',
      'Advanced search',
      'Distributed tracing',
      'Priority support',
      'API access',
    ],
    cta: 'Get started',
    highlighted: true,
    badge: 'Popular',
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: '/mo',
    description: 'For growing teams that ship every week.',
    features: [
      '1M logs / month',
      '90-day retention',
      'Real-time alerts',
      'Unlimited environments',
      '24/7 support',
      'API access',
    ],
    cta: 'Choose Pro',
  },
]
