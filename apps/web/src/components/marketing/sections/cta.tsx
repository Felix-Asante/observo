import { ArrowRight } from 'lucide-react'
import { ButtonLink, Section } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'

export function Cta() {
  return (
    <Section id="cta" size="compact" className="pb-24 md:pb-32">
      <Reveal>
        <div className="surface-panel relative overflow-hidden rounded-2xl px-6 py-16 text-center md:px-12 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_50%_-10%,var(--glow-iris),transparent_65%)]"
          />
          <div
            aria-hidden
            className="bg-grid-faint pointer-events-none absolute inset-0"
          />

          <div className="relative">
            <h2 className="text-gradient mx-auto max-w-2xl text-3xl font-medium tracking-heading text-balance sm:text-4xl md:text-5xl">
              Focus on your product.
              <br />
              We'll handle your logs.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-300 md:text-lg">
              Set up in under a minute. No learning curve. No maintenance. And
              your dashboards will finally agree with each other.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <ButtonLink href="#" size="lg">
                Get started
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="#" variant="secondary" size="lg">
                View docs
              </ButtonLink>
            </div>
            <p className="mt-7 font-mono text-xs text-ink-500">
              no credit card · 60-second setup · cancel anytime
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
