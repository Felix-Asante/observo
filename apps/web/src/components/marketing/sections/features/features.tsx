import { Section, SectionHeading, SpotlightCard, cn } from '@observo/ui'

import { RevealGroup, RevealGroupItem } from '#/components/animations/reveal'
import { features } from '#/data/content'
import { FeatureVisual } from './feature-visuals'

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Everything's connected"
        title="Everything you need. Nothing you don't."
        description="Simple tools that help you see what your app is doing, without learning a new system — logs, errors, traces, and alerts connected by the same trace ID."
      />

      <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <RevealGroupItem
            key={feature.id}
            className={cn(feature.span === 'wide' && 'lg:col-span-2')}
          >
            <SpotlightCard className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-ink-50">
                  {feature.title}
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-pretty text-ink-300">
                  {feature.description}
                </p>
              </div>
              <FeatureVisual visual={feature.visual} />
            </SpotlightCard>
          </RevealGroupItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
