import { Section } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { trustedBy } from '#/data/content'

export function TrustedBy() {
  return (
    <Section size="compact" aria-label="Trusted by engineering teams">
      <Reveal>
        <p className="label-mono mb-9 text-center text-ink-500">
          Loved by developers from the world's leading organizations
        </p>
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-14 pr-14 motion-reduce:animate-none">
            {[...trustedBy, ...trustedBy].map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="text-[0.9375rem] font-medium whitespace-nowrap text-ink-500 transition-colors duration-300 hover:text-ink-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
