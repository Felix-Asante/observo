import {
  Button,
  Card,
  Skeleton,
  StatusDot,
  buttonVariants,
  cn,
} from '@observo/ui'
import { getErrorMessage } from '@observo/utils'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertCircle, KeyRound, Radio, RefreshCw } from 'lucide-react'

import { AreaChart } from '#/components/dashboard/charts/area-chart'
import { ChartCard } from '#/components/dashboard/shared/chart-card'
import { MetricCard } from '#/components/dashboard/shared/metric-card'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import {
  buildOverviewMetricCards,
  formatOverviewDescription,
} from '#/utils/overview/format'
import { getOverviewQueryOptions } from '#/lib/tanstack-query/query-options/overview'

export const Route = createFileRoute('/(app)/dashboard/')({
  head: () => ({ meta: [{ title: 'Overview · Observo' }] }),
  component: OverviewPage,
})

function OverviewPage() {
  const { data, error, isPending, isError, isFetching, refetch } = useQuery(
    getOverviewQueryOptions(),
  )

  const showSkeleton = isPending && !data
  const isRefreshing = isFetching && !isPending
  const metrics = data ? buildOverviewMetricCards(data.metrics) : []
  const volumeSeries = data?.volumeSeries ?? []
  const systemStatus = data?.systemStatus ?? []

  return (
    <>
      <PageHeader
        title="Overview"
        description={
          showSkeleton
            ? 'Loading workspace health…'
            : data
              ? formatOverviewDescription(data.metrics.events24h)
              : 'Workspace health and ingest activity for the last 24 hours.'
        }
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              loading={isRefreshing}
              disabled={showSkeleton}
              aria-label="Refresh overview"
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
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

      {isError ? (
        <div
          role="alert"
          className="mb-4 flex flex-col gap-3 rounded-lg border border-error/30 bg-error/6 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-error"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-ink-100">
                Couldn't load overview
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            loading={isRefreshing}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <Card
        className={cn(
          'mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3.5 transition-opacity duration-200',
          isRefreshing && 'opacity-60',
        )}
      >
        {showSkeleton
          ? Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          : systemStatus.map((system) => (
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

      <div
        className={cn(
          'mb-6 grid gap-4 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-4',
          isRefreshing && 'opacity-60',
        )}
      >
        {showSkeleton
          ? Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-7 w-24" />
                <Skeleton className="mt-2 h-3 w-16" />
              </Card>
            ))
          : metrics.map((metric) => <MetricCard key={metric.id} {...metric} />)}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-1">
        <ChartCard
          title="Log volume"
          subtitle="events per hour · last 24h"
          className={cn(isRefreshing && 'opacity-60')}
        >
          {showSkeleton ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : volumeSeries.length > 1 ? (
            <AreaChart data={volumeSeries} xLabels={['24h ago', 'now']} />
          ) : (
            <p className="py-12 text-center font-mono text-xs text-ink-500">
              No volume data yet for the last 24 hours.
            </p>
          )}
        </ChartCard>
      </div>

      {/* <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Top applications"
          subtitle="by event volume · coming soon"
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
                  <Tr key={app.name} className="opacity-50">
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
      </div> */}
    </>
  )
}
