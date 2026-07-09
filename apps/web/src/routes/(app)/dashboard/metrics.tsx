import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@observo/ui'

import { AreaChart } from '#/components/dashboard/charts/area-chart'
import { Sparkline } from '#/components/dashboard/charts/sparkline'
import { ChartCard } from '#/components/dashboard/shared/chart-card'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { metricDefinitions, metricSeries } from '#/data/dashboard/metrics'

export const Route = createFileRoute('/(app)/dashboard/metrics')({
  head: () => ({ meta: [{ title: 'Metrics · Observo' }] }),
  component: MetricsPage,
})

function MetricsPage() {
  return (
    <>
      <PageHeader
        title="Metrics"
        description="Platform and application metrics derived from structured log fields and ingest telemetry."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricDefinitions.map((metric) => (
          <Card key={metric.id} className="p-5">
            <p className="font-mono text-2xs text-iris-400">{metric.name}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-2xl font-semibold tracking-tight text-ink-50">
                  {metric.value}
                  <span className="ml-1 text-sm font-normal text-ink-500">
                    {metric.unit}
                  </span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
                  {metric.description}
                </p>
              </div>
              <Sparkline
                data={metric.trend}
                className="hidden shrink-0 sm:block"
              />
            </div>
          </Card>
        ))}
      </div>

      <ChartCard title="Ingest volume" subtitle="events per hour · last 24h">
        <AreaChart data={metricSeries} xLabels={['24h ago', 'now']} />
      </ChartCard>
    </>
  )
}
