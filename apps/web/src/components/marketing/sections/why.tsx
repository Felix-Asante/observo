import { Section, SectionHeading } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { whyParagraphs } from '#/data/content'

export function Why() {
  return (
    <Section id="why" containerClassName="max-w-4xl">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Why Observo exists"
          title="Observability shouldn't feel like a whole other job."
          className="mb-0 md:mb-0"
        />
        <Reveal delay={0.1}>
          <div className="space-y-6">
            {whyParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-pretty text-ink-300"
              >
                {paragraph}
              </p>
            ))}
            <p className="text-base leading-relaxed font-medium text-ink-100">
              It's observability that just works — instead of becoming another
              system you have to maintain.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
