import { Check, X } from 'lucide-react'
import { Card, Section, SectionHeading } from '@observo/ui'

import { RevealGroup, RevealGroupItem } from '#/components/animations/reveal'
import { comparison } from '#/data/content'

export function Comparison() {
  return (
    <Section id="comparison" className="bg-section-raise">
      <SectionHeading
        eyebrow="Before / after"
        title="Why developers switch to Observo"
        description="See at a glance how life looks before and after you plug in Observo."
      />

      <RevealGroup className="grid gap-4 md:grid-cols-2 md:gap-5">
        <RevealGroupItem>
          <Card variant="inset" className="h-full p-7 md:p-8">
            <p className="label-mono mb-7 text-ink-500">Without Observo</p>
            <ul className="space-y-4">
              {comparison.without.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                >
                  <X
                    className="mt-0.5 size-4 shrink-0 text-ink-600"
                    aria-hidden
                  />
                  <span className="text-ink-400">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </RevealGroupItem>

        <RevealGroupItem>
          <Card
            variant="panel"
            className="h-full border-iris-500/25 p-7 md:p-8"
          >
            <p className="label-mono mb-7 text-iris-400">With Observo</p>
            <ul className="space-y-4">
              {comparison.with.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-iris-400"
                    aria-hidden
                  />
                  <span className="text-ink-100">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </RevealGroupItem>
      </RevealGroup>
    </Section>
  )
}
