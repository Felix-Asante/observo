import { Link } from '@tanstack/react-router'
import { Logo, StatusDot } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { LogExplorer } from '#/components/marketing/hero/log-explorer'
import { stats } from '#/data/stats'

const highlights = [
  { value: `${stats.searchP99Ms}ms`, label: 'p99 search' },
  { value: stats.ingestPerMin, label: 'logs/min' },
  { value: `<${stats.setupSeconds}s`, label: 'to first log' },
] as const

/**
 * Left panel of the auth screens: sells the product with the live
 * log explorer, key numbers, and an engineer's voice.
 */
export function AuthHeroPanel() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border-r border-border-subtle p-10 xl:p-14">
      <div
        aria-hidden
        className="bg-hero-depth pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="bg-grid-faint pointer-events-none absolute inset-0"
      />

      <div className="relative">
        <Link
          to="/"
          aria-label="Back to Observo home"
          className="inline-flex cursor-pointer"
        >
          <Logo />
        </Link>
      </div>

      <div className="relative my-auto max-w-xl py-12">
        <Reveal>
          <h2 className="text-gradient text-3xl font-medium tracking-heading text-balance xl:text-4xl">
            Production is talking.
            <br />
            Come listen.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-6 mb-9 flex items-center gap-6">
            {highlights.map((item) => (
              <div key={item.label}>
                <p className="font-mono text-lg font-semibold text-ink-50">
                  {item.value}
                </p>
                <p className="mt-0.5 text-2xs tracking-wide text-ink-500 uppercase">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16} y={20}>
          <LogExplorer />
        </Reveal>
      </div>

      <Reveal delay={0.2} className="relative">
        <figure className="max-w-md">
          <blockquote className="text-sm leading-relaxed text-ink-300">
            “Setup was insanely fast. I dropped in the SDK and real logs were
            streaming before my coffee got cold.”
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-2 text-xs text-ink-500">
            <StatusDot tone="iris" />
            Maya Lindqvist · Platform Lead, Arcline
          </figcaption>
        </figure>
      </Reveal>
    </div>
  )
}
