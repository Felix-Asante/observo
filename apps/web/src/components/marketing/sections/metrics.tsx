import { Section } from '@observo/ui'

import { AnimatedCounter } from '#/components/animations/animated-counter'
import { RevealGroup, RevealGroupItem } from '#/components/animations/reveal'
import { metrics } from '#/data/content'

export function Metrics() {
  return (
    <Section
      size="compact"
      className="border-y border-border-subtle bg-section-raise"
    >
      <RevealGroup className="grid gap-12 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:text-left">
        {metrics.map((metric) => (
          <RevealGroupItem key={metric.label}>
            <p className="font-mono text-4xl font-semibold tracking-tight text-ink-50 md:text-[2.75rem]">
              <AnimatedCounter
                value={metric.value}
                decimals={metric.decimals}
                prefix={'prefix' in metric ? metric.prefix : ''}
                suffix={metric.suffix}
              />
            </p>
            <p className="mt-3 text-sm font-medium text-ink-100">
              {metric.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
              {metric.detail}
            </p>
          </RevealGroupItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
