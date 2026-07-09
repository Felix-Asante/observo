import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import {
  FilterBar,
  type LogFilters,
} from '#/components/dashboard/logs/filter-bar'
import { LogDrawer } from '#/components/dashboard/logs/log-drawer'
import { LogsTable } from '#/components/dashboard/logs/logs-table'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { logEvents } from '#/data/dashboard/logs'
import type { LogEvent } from '#/data/dashboard/types'

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

function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>(defaultFilters)
  const [selected, setSelected] = useState<LogEvent | null>(null)

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    return logEvents.filter((log) => {
      if (filters.level !== 'all' && log.level !== filters.level) return false
      if (filters.app !== 'all' && log.appName !== filters.app) return false
      if (
        filters.environment !== 'all' &&
        log.environment !== filters.environment
      )
        return false
      if (query && !log.message.toLowerCase().includes(query)) return false
      return true
    })
  }, [filters])

  return (
    <>
      <PageHeader
        title="Logs"
        description="Search and filter every event across your applications. Queries hit ClickHouse and return in milliseconds."
      />
      <FilterBar filters={filters} onChange={setFilters} />
      <LogsTable
        logs={filtered}
        onSelect={setSelected}
        onClearFilters={() => setFilters(defaultFilters)}
      />
      <LogDrawer log={selected} onClose={() => setSelected(null)} />
    </>
  )
}
