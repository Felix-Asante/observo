import { createFileRoute } from '@tanstack/react-router'
import { TBody, THead, Table, Td, Th, Tr, cn } from '@observo/ui'

import { AreaChart } from '#/components/dashboard/charts/area-chart'
import { ChartCard } from '#/components/dashboard/shared/chart-card'
import { MetricCard } from '#/components/dashboard/shared/metric-card'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import {
  endpointLatency,
  latencySeries,
  performanceMetrics,
} from '#/data/dashboard/performance'

export const Route = createFileRoute('/(app)/dashboard/performance')({
  head: () => ({ meta: [{ title: 'Performance · Observo' }] }),
  component: PerformancePage,
})

function PerformancePage() {
  return (
    <>
      <PageHeader
        title="Performance"
        description="Request latency across services and endpoints — derived from log metrics and trace spans."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Latency percentiles"
          subtitle="ms · last 24h"
          className="lg:col-span-2"
        >
          <AreaChart data={latencySeries.p95} xLabels={['24h ago', 'now']} />
        </ChartCard>
        <ChartCard title="p99 by hour" subtitle="peak detection">
          <AreaChart data={latencySeries.p99} xLabels={['24h ago', 'now']} />
        </ChartCard>
      </div>

      <ChartCard title="Endpoint latency" subtitle="sorted by p99 · production">
        <div className="-m-5">
          <Table>
            <THead>
              <tr>
                <Th>Endpoint</Th>
                <Th className="text-right">p50</Th>
                <Th className="text-right">p95</Th>
                <Th className="text-right">p99</Th>
                <Th className="hidden text-right sm:table-cell">Requests</Th>
              </tr>
            </THead>
            <TBody>
              {endpointLatency.map((row) => (
                <Tr key={row.endpoint}>
                  <Td className="font-mono text-xs text-ink-100">
                    {row.endpoint}
                  </Td>
                  <Td className="text-right font-mono text-xs text-ink-400">
                    {row.p50}ms
                  </Td>
                  <Td className="text-right font-mono text-xs text-ink-400">
                    {row.p95}ms
                  </Td>
                  <Td
                    className={cn(
                      'text-right font-mono text-xs',
                      row.p99 > 1000 ? 'text-error' : 'text-ink-100',
                    )}
                  >
                    {row.p99}ms
                  </Td>
                  <Td className="hidden text-right font-mono text-xs text-ink-500 sm:table-cell">
                    {row.requests}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </ChartCard>
    </>
  )
}
