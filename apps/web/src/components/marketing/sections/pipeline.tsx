import { Fragment } from 'react'
import { Section, SectionHeading } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { PipelineBeam } from '#/components/illustrations/pipeline-beam'
import { pipelineStages } from '#/data/content'

export function Pipeline() {
  return (
    <Section id="pipeline" className="bg-section-raise">
      <SectionHeading
        eyebrow="How it works"
        title="From log line to insight in milliseconds"
        description="Events flow through a durable, horizontally-scalable pipeline. No agents to babysit, no clusters to size."
      />

      <Reveal>
        {/* Desktop: horizontal flow */}
        <div className="hidden items-center md:flex">
          {pipelineStages.map((stage, index) => (
            <Fragment key={stage.id}>
              {index > 0 ? (
                <PipelineBeam className="mx-1 flex-1" delay={index * 0.55} />
              ) : null}
              <StageNode
                label={stage.label}
                sub={stage.sub}
                highlight={stage.id === 'clickhouse'}
              />
            </Fragment>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex flex-col items-center md:hidden">
          {pipelineStages.map((stage, index) => (
            <Fragment key={stage.id}>
              {index > 0 ? (
                <PipelineBeam orientation="vertical" delay={index * 0.55} />
              ) : null}
              <StageNode
                label={stage.label}
                sub={stage.sub}
                highlight={stage.id === 'clickhouse'}
                wide
              />
            </Fragment>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
          {[
            {
              title: 'Durable by default',
              body: 'Every event is acknowledged into NATS JetStream before ingestion returns. Nothing is dropped, even under backpressure.',
            },
            {
              title: 'Columnar storage',
              body: 'ClickHouse compresses events ~10x and scans billions of rows per second, so retention is cheap and queries stay fast.',
            },
            {
              title: 'Real-time fan-out',
              body: 'The same stream powers live tail, alert evaluation, and dashboards — with end-to-end latency under 200ms.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-border pt-5">
              <h3 className="text-[0.9375rem] font-medium text-ink-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

function StageNode({
  label,
  sub,
  highlight,
  wide,
}: {
  label: string
  sub: string
  highlight?: boolean
  wide?: boolean
}) {
  return (
    <div
      className={`surface-card shrink-0 rounded-xl px-5 py-4 text-center ${
        highlight ? 'border-iris-500/30 bg-iris-500/[0.06]' : ''
      } ${wide ? 'w-56' : ''}`}
    >
      <p
        className={`text-sm font-semibold ${highlight ? 'text-iris-300' : 'text-ink-50'}`}
      >
        {label}
      </p>
      <p className="mt-0.5 font-mono text-2xs text-ink-500">{sub}</p>
    </div>
  )
}
