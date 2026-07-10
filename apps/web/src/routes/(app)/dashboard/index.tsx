import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, KeyRound, Radio } from 'lucide-react'
import {
  Card,
  StatusDot,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
  buttonVariants,
  cn,
} from '@observo/ui'

import { AreaChart } from '#/components/dashboard/charts/area-chart'
import { BarList } from '#/components/dashboard/charts/bar-list'
import { Sparkline } from '#/components/dashboard/charts/sparkline'
import { ActivityFeed } from '#/components/dashboard/overview/activity-feed'
import { ChartCard } from '#/components/dashboard/shared/chart-card'
import { MetricCard } from '#/components/dashboard/shared/metric-card'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import {
  errorsByService,
  overviewMetrics,
  systemStatus,
  topApps,
  volumeSeries,
} from '#/data/dashboard/overview'
import { getCurrentUserAction } from '#/actions/auth-actions'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/(app)/dashboard/')({
  head: () => ({ meta: [{ title: 'Overview · Observo' }] }),
  component: OverviewPage,
})

function OverviewPage() {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserAction,
  })

  console.log({ currentUser })

  return (
    <>
      <PageHeader
        title="Overview"
        description="Production is healthy. 1.28M events ingested in the last 24 hours."
        actions={
          <>
            <Link
              to="/dashboard/live"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
              )}
            >
              <Radio className="size-3.5 text-success" aria-hidden />
              Live tail
            </Link>
            <Link
              to="/dashboard/api-keys"
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              <KeyRound className="size-3.5" aria-hidden />
              Create API key
            </Link>
          </>
        }
      />

      {/* System status strip */}
      <Card className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3.5">
        {systemStatus.map((system) => (
          <div key={system.name} className="flex items-center gap-2.5">
            <StatusDot
              tone={system.status === 'operational' ? 'success' : 'warning'}
              pulse={system.status === 'operational'}
            />
            <span className="text-sm text-ink-200">{system.name}</span>
            <span className="font-mono text-2xs text-ink-500">
              {system.detail}
            </span>
          </div>
        ))}
      </Card>

      {/* Metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Log volume"
          subtitle="events per hour · last 24h"
          className="lg:col-span-2"
        >
          <AreaChart data={volumeSeries} xLabels={['24h ago', 'now']} />
        </ChartCard>
        <ChartCard title="Errors by service" subtitle="last 24h">
          <BarList items={errorsByService} />
        </ChartCard>
      </div>

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Top applications"
          subtitle="by event volume"
          className="lg:col-span-2"
          actions={
            <Link
              to="/dashboard/logs"
              className="flex cursor-pointer items-center gap-1 text-xs text-ink-400 transition-colors hover:text-iris-200"
            >
              View logs
              <ArrowUpRight className="size-3" aria-hidden />
            </Link>
          }
        >
          <div className="-m-5">
            <Table>
              <THead>
                <tr>
                  <Th>App</Th>
                  <Th className="hidden sm:table-cell">Env</Th>
                  <Th className="text-right">Events</Th>
                  <Th className="text-right">Errors</Th>
                  <Th className="hidden text-right sm:table-cell">p95</Th>
                  <Th className="hidden xl:table-cell">Trend</Th>
                </tr>
              </THead>
              <TBody>
                {topApps.map((app) => (
                  <Tr key={app.name}>
                    <Td className="font-mono text-xs font-medium text-ink-100">
                      {app.name}
                    </Td>
                    <Td className="hidden font-mono text-xs text-ink-500 sm:table-cell">
                      {app.environment}
                    </Td>
                    <Td className="text-right font-mono text-xs">
                      {app.events}
                    </Td>
                    <Td
                      className={cn(
                        'text-right font-mono text-xs',
                        app.errors > 50 ? 'text-error' : 'text-ink-400',
                      )}
                    >
                      {app.errors}
                    </Td>
                    <Td className="hidden text-right font-mono text-xs text-ink-400 sm:table-cell">
                      {app.p95}
                    </Td>
                    <Td className="hidden xl:table-cell">
                      <Sparkline
                        data={app.trend}
                        className="h-6 w-20"
                        strokeClass="text-ink-500"
                      />
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </ChartCard>

        <ChartCard title="Recent activity" subtitle="workspace events">
          <ActivityFeed />
        </ChartCard>
      </div>
    </>
  )
}
