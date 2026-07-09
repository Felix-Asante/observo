import { SearchX } from 'lucide-react'
import { EmptyState, TBody, THead, Table, Td, Th, Tr } from '@observo/ui'

import { LevelBadge } from '#/components/dashboard/shared/level-badge'
import type { LogEvent } from '#/data/dashboard/types'

type LogsTableProps = {
  logs: Array<LogEvent>
  onSelect: (log: LogEvent) => void
  onClearFilters: () => void
}

export function LogsTable({ logs, onSelect, onClearFilters }: LogsTableProps) {
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
    <div className="surface-card overflow-hidden rounded-xl">
      <Table>
        <THead>
          <tr>
            <Th className="w-28">Time</Th>
            <Th className="w-24">Level</Th>
            <Th>Message</Th>
            <Th className="w-28">App</Th>
            <Th className="hidden w-28 xl:table-cell">Env</Th>
            <Th className="hidden w-20 text-right 2xl:table-cell">Latency</Th>
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
          {logs.length} events · sorted by{' '}
          <span className="text-ink-300">timestamp desc</span>
        </span>
        <span>limit 100 · retention 30d</span>
      </div>
    </div>
  )
}
