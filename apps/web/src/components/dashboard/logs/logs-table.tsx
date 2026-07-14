import { SearchX } from 'lucide-react'
import { EmptyState, TBody, THead, Table, Td, Th, Tr, cn } from '@observo/ui'

import { LevelBadge } from '#/components/dashboard/shared/level-badge'
import { TableLoader } from '#/components/dashboard/shared/table-loader'
import type { TableLoaderColumn } from '#/components/dashboard/shared/table-loader'
import type { LogEvent } from '#/data/dashboard/types'
import { DEFAULT_LOGS_LIMIT } from '#/lib/tanstack-query/query-options/logs-query-options'

const LOG_COLUMNS: Array<TableLoaderColumn> = [
  {
    header: 'Time',
    headerClassName: 'w-28',
    skeletonClassName: 'h-4 w-20',
  },
  {
    header: 'Level',
    headerClassName: 'w-24',
    skeletonClassName: 'h-5 w-14 rounded',
  },
  { header: 'Message', skeletonClassName: 'h-4 w-full max-w-md' },
  {
    header: 'App',
    headerClassName: 'w-28',
    skeletonClassName: 'h-4 w-16',
  },
  {
    header: 'Env',
    headerClassName: 'hidden w-28 xl:table-cell',
    cellClassName: 'hidden xl:table-cell',
    skeletonClassName: 'h-4 w-16',
  },
  {
    header: 'Latency',
    headerClassName: 'hidden w-20 text-right 2xl:table-cell',
    cellClassName: 'hidden 2xl:table-cell',
    skeletonClassName: 'ml-auto h-4 w-10',
  },
]

type LogsTableProps = {
  logs: Array<LogEvent>
  loading?: boolean
  refreshing?: boolean
  count?: number
  totalCount?: number
  onSelect: (log: LogEvent) => void
  onClearFilters: () => void
}

export function LogsTable({
  logs,
  loading = false,
  refreshing = false,
  count,
  totalCount,
  onSelect,
  onClearFilters,
}: LogsTableProps) {
  if (loading) {
    return <TableLoader columns={LOG_COLUMNS} rows={8} label="Loading logs" />
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-5" aria-hidden />}
        title="No logs match your filters"
        description="Try widening the time range or removing a filter. Logs are retained for 30 days."
        action={
          <button
            type="button"
            onClick={onClearFilters}
            className="cursor-pointer text-sm text-iris-300 transition-colors hover:text-iris-200"
          >
            Clear all filters
          </button>
        }
      />
    )
  }

  return (
    <div
      className={cn(
        'surface-card overflow-hidden rounded-xl transition-opacity duration-200',
        refreshing && 'opacity-60',
      )}
    >
      <Table>
        <THead>
          <tr>
            {LOG_COLUMNS.map((column, index) => (
              <Th key={index} className={column.headerClassName}>
                {column.header}
              </Th>
            ))}
          </tr>
        </THead>
        <TBody>
          {logs.map((log) => (
            <Tr
              key={log.id}
              interactive
              tabIndex={0}
              onClick={() => onSelect(log)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(log)
                }
              }}
            >
              <Td className="font-mono text-xs whitespace-nowrap text-ink-500">
                {log.time}
              </Td>
              <Td>
                <LevelBadge level={log.level} />
              </Td>
              <Td className="max-w-0 truncate font-mono text-xs text-ink-100">
                {log.message}
              </Td>
              <Td className="font-mono text-xs text-ink-400">{log.appName}</Td>
              <Td className="hidden font-mono text-xs text-ink-500 xl:table-cell">
                {log.environment}
              </Td>
              <Td className="hidden text-right font-mono text-xs text-ink-500 2xl:table-cell">
                {log.latencyMs !== undefined ? `${log.latencyMs}ms` : '—'}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2.5 font-mono text-2xs text-ink-500">
        <span>
          {count ?? logs.length} events
          {totalCount !== undefined ? (
            <>
              {' '}
              ·{' '}
              <span className="text-ink-300">
                {totalCount.toLocaleString()} in last 24h
              </span>
            </>
          ) : null}{' '}
          · sorted by <span className="text-ink-300">timestamp desc</span>
        </span>
        <span>limit {DEFAULT_LOGS_LIMIT} · retention 30d</span>
      </div>
    </div>
  )
}
