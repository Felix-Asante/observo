import { Check } from 'lucide-react'
import {
  Badge,
  ButtonLink,
  Card,
  Section,
  SectionHeading,
  cn,
} from '@observo/ui'

import {
  Reveal,
  RevealGroup,
  RevealGroupItem,
} from '#/components/animations/reveal'
import { pricingPlans } from '#/data/pricing'

export function Pricing() {
  return (
    <Section id="pricing" className="bg-section-raise">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, predictable pricing"
        description="Start for free. Upgrade when you grow — no hidden fees, no surprise bills at the end of the month."
      />

      <RevealGroup className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {pricingPlans.map((plan) => (
          <RevealGroupItem key={plan.name}>
            <Card
              variant={plan.highlighted ? 'panel' : 'default'}
              className={cn(
                'relative flex h-full flex-col p-7 md:p-8',
                plan.highlighted && 'border-iris-500/35',
              )}
            >
              {plan.badge ? (
                <Badge variant="iris" className="absolute -top-3 right-7">
                  {plan.badge}
                </Badge>
              ) : null}

              <h3 className="text-sm font-semibold tracking-wide text-ink-100 uppercase">
                {plan.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-ink-50">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-sm text-ink-400">{plan.period}</span>
                ) : null}
              </p>
              <p className="mt-2.5 text-sm text-ink-400">{plan.description}</p>

              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-ink-200"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-iris-400"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="#cta"
                variant={plan.highlighted ? 'primary' : 'secondary'}
                className="mt-9 w-full"
              >
                {plan.cta}
              </ButtonLink>
            </Card>
          </RevealGroupItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-ink-400">
          Ingesting more than a few million logs a month?{' '}
          <a
            href="#cta"
            className="cursor-pointer font-medium text-iris-300 underline-offset-4 transition-colors duration-200 hover:text-iris-200 hover:underline"
          >
            Talk to us about Scale
          </a>{' '}
          — custom volume, longer retention, SSO, audit logs, and dedicated
          regions.
        </p>
      </Reveal>
    </Section>
  )
}
