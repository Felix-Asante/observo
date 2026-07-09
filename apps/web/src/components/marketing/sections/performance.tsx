import { motion, useReducedMotion } from 'motion/react'
import { Section, SectionHeading } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { stats } from '#/data/stats'

const comparisons = [
  { name: 'Observo', ms: stats.searchP99Ms, share: 4, accent: true },
  { name: 'Elasticsearch', ms: 850, share: 58 },
  { name: 'Loki + Grafana', ms: 1400, share: 100 },
]

export function Performance() {
  const reducedMotion = useReducedMotion()

  return (
    <Section
      id="performance"
      className="border-y border-border-subtle bg-section-raise"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="ClickHouse powered"
            title="Queries that finish before you blink"
            description="Most log platforms bolt search onto storage built for something else. Observo runs on ClickHouse — a columnar engine designed to scan billions of rows per second."
            className="mb-8 md:mb-10"
          />
          <dl className="grid grid-cols-3 gap-6">
            {[
              { term: 'Compression', detail: stats.compression },
              { term: 'Scan rate', detail: stats.scanRate },
              { term: 'Retention cost', detail: '-72%' },
            ].map((stat) => (
              <div key={stat.term}>
                <dt className="text-2xs font-medium tracking-wide text-ink-500 uppercase">
                  {stat.term}
                </dt>
                <dd className="mt-1.5 font-mono text-xl font-semibold text-ink-50">
                  {stat.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal y={24}>
          <div className="surface-panel rounded-xl p-6 md:p-8">
            <p className="label-mono mb-7 text-ink-500">
              p99 search · 1B events · full-text filter
            </p>
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span
                      className={
                        item.accent
                          ? 'text-sm font-semibold text-iris-300'
                          : 'text-sm text-ink-300'
                      }
                    >
                      {item.name}
                    </span>
                    <span className="font-mono text-xs text-ink-400">
                      {item.ms}ms
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-950/80">
                    <motion.div
                      initial={
                        reducedMotion
                          ? { width: `${item.share}%` }
                          : { width: 0 }
                      }
                      whileInView={{ width: `${item.share}%` }}
                      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                      transition={{
                        duration: 1.1,
                        delay: 0.15 + index * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={
                        item.accent
                          ? 'h-full rounded-full bg-gradient-to-r from-iris-500 to-iris-300'
                          : 'h-full rounded-full bg-ink-600'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-7 text-xs leading-relaxed text-ink-500">
              Representative internal benchmark. Your workload will vary — but
              not by enough to make it close.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
