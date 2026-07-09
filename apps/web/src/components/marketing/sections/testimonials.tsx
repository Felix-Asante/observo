import { Card, Section, SectionHeading } from '@observo/ui'

import { RevealGroup, RevealGroupItem } from '#/components/animations/reveal'
import { testimonials } from '#/data/content'

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Loved by developers worldwide"
        title="Developers who ship fast love Observo"
        description="From launch-day debugging to 3am incidents — what changed when they switched."
      />

      <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <RevealGroupItem key={testimonial.name}>
            <Card className="flex h-full flex-col justify-between gap-8 p-6 md:p-7">
              <blockquote className="text-[0.9375rem] leading-relaxed text-pretty text-ink-200">
                “{testimonial.quote}”
              </blockquote>
              <footer className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-iris-500/25 bg-iris-500/10 text-xs font-semibold text-iris-300"
                >
                  {testimonial.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-50">
                    {testimonial.name}
                  </p>
                  <p className="font-mono text-xs text-ink-400">
                    {testimonial.handle}
                  </p>
                </div>
              </footer>
            </Card>
          </RevealGroupItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
