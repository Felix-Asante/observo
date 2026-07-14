import { useDeferredValue, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button, cn } from '@observo/ui'
import { getErrorMessage } from '@observo/utils'

import { FilterBar } from '#/components/dashboard/logs/filter-bar'
import type { LogFilters } from '#/components/dashboard/logs/filter-bar'
import { LogDrawer } from '#/components/dashboard/logs/log-drawer'
import { LogsTable } from '#/components/dashboard/logs/logs-table'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import type { LogEvent, LogLevel } from '#/data/dashboard/types'
import { mapApiLogsToEvents } from '#/utils/logs/map-api-log'
import {
  DEFAULT_LOGS_LIMIT,
  getLogsQueryOptions,
} from '#/lib/tanstack-query/query-options/logs-query-options'
import type { GetLogsParams } from '#/types/logs'

export const Route = createFileRoute('/(app)/dashboard/logs')({
  head: () => ({ meta: [{ title: 'Logs · Observo' }] }),
  component: LogsPage,
})

const defaultFilters: LogFilters = {
  search: '',
  level: 'all',
  app: 'all',
  environment: 'all',
  range: '24h',
}

function filtersToParams(filters: LogFilters): GetLogsParams {
  const search = filters.search.trim()
  return {
    limit: DEFAULT_LOGS_LIMIT,
    range: filters.range,
    search: search || undefined,
    type: filters.level !== 'all' ? (filters.level as LogLevel) : undefined,
    appName: filters.app !== 'all' ? filters.app : undefined,
    env: filters.environment !== 'all' ? filters.environment : undefined,
  }
}

function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>(defaultFilters)
  const [selected, setSelected] = useState<LogEvent | null>(null)
  const deferredFilters = useDeferredValue(filters)
  const params = useMemo(
    () => filtersToParams(deferredFilters),
    [deferredFilters],
  )

  const { data, error, isPending, isError, isFetching, refetch } = useQuery(
    getLogsQueryOptions(params),
  )

  const logs = useMemo(() => mapApiLogsToEvents(data?.logs ?? []), [data?.logs])

  const showSkeleton = isPending && !data
  const isRefreshing = isFetching && !isPending
  const filtersPending =
    filters !== deferredFilters &&
    (filters.search !== deferredFilters.search ||
      filters.level !== deferredFilters.level ||
      filters.app !== deferredFilters.app ||
      filters.environment !== deferredFilters.environment ||
      filters.range !== deferredFilters.range)

  return (
    <>
      <PageHeader
        title="Logs"
        description="Search and filter every event across your applications. Queries hit ClickHouse and return in milliseconds."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            loading={isRefreshing}
            disabled={showSkeleton}
            aria-label="Refresh logs"
          >
            <RefreshCw className="size-3.5" aria-hidden />
            Refresh
          </Button>
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
                Couldn't load logs
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

      <FilterBar filters={filters} onChange={setFilters} />

      <div
        className={cn(
          'transition-opacity duration-200',
          (isRefreshing || filtersPending) && 'opacity-60',
        )}
      >
        <LogsTable
          logs={logs}
          loading={showSkeleton}
          refreshing={isRefreshing || filtersPending}
          count={data?.count}
          totalCount={data?.totalCount}
          onSelect={setSelected}
          onClearFilters={() => setFilters(defaultFilters)}
        />
      </div>

      <LogDrawer log={selected} onClose={() => setSelected(null)} />
    </>
  )
}
