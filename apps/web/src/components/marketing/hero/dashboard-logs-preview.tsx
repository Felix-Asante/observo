import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Download, Radio, Search } from 'lucide-react'
import {
  Select,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
  buttonVariants,
  cn,
} from '@observo/ui'

import { LevelBadge } from '#/components/dashboard/shared/level-badge'
import { savedSearches, timeRanges } from '#/data/dashboard/logs'
import type { Environment, LogEvent, LogLevel } from '#/data/dashboard/types'

const VISIBLE_ROWS = 6
const LOGS_LIMIT = 100

const demoLogs = [
  {
    time: '14:32:01.284',
    level: 'info',
    message: 'POST /v1/checkout 201 · 42ms',
    appName: 'api',
    environment: 'production',
    latencyMs: 42,
  },
  {
    time: '14:32:01.612',
    level: 'debug',
    message: 'hit user:usr_8f2 profile',
    appName: 'cache',
    environment: 'production',
    latencyMs: 2,
  },
  {
    time: '14:32:02.033',
    level: 'info',
    message: 'invoice.paid → webhook queued',
    appName: 'payments',
    environment: 'production',
    latencyMs: 18,
  },
  {
    time: '14:32:02.418',
    level: 'warning',
    message: 'retry queue depth 12 (threshold 50)',
    appName: 'workers',
    environment: 'staging',
    latencyMs: 64,
  },
  {
    time: '14:32:02.902',
    level: 'info',
    message: 'GET /v1/orders 200 · 8ms',
    appName: 'api',
    environment: 'production',
    latencyMs: 8,
  },
  {
    time: '14:32:03.155',
    level: 'error',
    message: 'stripe timeout after 5000ms · trace 4fa2',
    appName: 'payments',
    environment: 'production',
    latencyMs: 5000,
  },
  {
    time: '14:32:03.514',
    level: 'success',
    message: 'GET /v1/health 200 · 1ms',
    appName: 'api',
    environment: 'production',
    latencyMs: 1,
  },
  {
    time: '14:32:03.987',
    level: 'audit',
    message: 'session issued for usr_2c41',
    appName: 'auth',
    environment: 'production',
    latencyMs: 12,
  },
] as const

const levels: Array<LogLevel | 'all'> = [
  'all',
  'info',
  'error',
  'warning',
  'debug',
  'trace',
  'audit',
  'success',
]

type PreviewFilters = {
  search: string
  level: string
  environment: string
  range: string
}

const defaultFilters: PreviewFilters = {
  search: '',
  level: 'all',
  environment: 'all',
  range: '24h',
}

function toLogEvent(
  line: (typeof demoLogs)[number],
  key: number,
): LogEvent {
  return {
    id: `home-${key}`,
    time: line.time,
    date: 'Jul 18',
    level: line.level,
    message: line.message,
    appName: line.appName,
    environment: line.environment as Environment,
    latencyMs: line.latencyMs,
    payload: {},
  }
}

/**
 * Home-page product preview shaped like the dashboard Logs page.
 * Auth screens keep the original CodeWindow LogExplorer.
 */
export function DashboardLogsPreview() {
  const reducedMotion = useReducedMotion()
  const [cursor, setCursor] = useState(VISIBLE_ROWS)
  const [filters, setFilters] = useState<PreviewFilters>(defaultFilters)

  useEffect(() => {
    if (reducedMotion) return
    const interval = window.setInterval(() => {
      setCursor((current) => current + 1)
    }, 2200)
    return () => window.clearInterval(interval)
  }, [reducedMotion])

  const pool = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    return demoLogs.filter((line) => {
      if (filters.level !== 'all' && line.level !== filters.level) return false
      if (
        filters.environment !== 'all' &&
        line.environment !== filters.environment
      ) {
        return false
      }
      if (query && !line.message.toLowerCase().includes(query)) return false
      return true
    })
  }, [filters])

  const rows = useMemo(() => {
    if (pool.length === 0) return []
    const count = Math.min(VISIBLE_ROWS, pool.length)
    return Array.from({ length: count }, (_, i) => {
      const index = (cursor - count + i + pool.length * 100) % pool.length
      return toLogEvent(pool[index], cursor - count + i)
    })
  }, [cursor, pool])

  const set = (patch: Partial<PreviewFilters>) =>
    setFilters((current) => ({ ...current, ...patch }))

  return (
    <div
      className="relative w-full text-left"
      aria-label="Observo logs explorer preview"
    >
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-40 flex-1 sm:min-w-56">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-500"
              aria-hidden
            />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => set({ search: event.target.value })}
              placeholder="Search messages…  e.g. timeout"
              aria-label="Search log messages"
              className="h-9 w-full rounded-lg border border-border bg-white/[0.02] pr-3 pl-9 font-mono text-xs text-ink-100 transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-ink-600 hover:border-border-strong focus:border-iris-400/60 focus:shadow-[0_0_0_3px_var(--glow-iris-soft)]"
            />
          </div>

          <Select
            label="Level"
            hideLabel
            value={filters.level}
            onChange={(event) => set({ level: event.target.value })}
            className="w-30"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === 'all' ? 'All levels' : level}
              </option>
            ))}
          </Select>

          <Select
            label="Environment"
            hideLabel
            value={filters.environment}
            onChange={(event) => set({ environment: event.target.value })}
            className="hidden w-34 sm:block"
          >
            <option value="all">All envs</option>
            <option value="production">production</option>
            <option value="staging">staging</option>
            <option value="development">development</option>
          </Select>

          <Select
            label="Time range"
            hideLabel
            value={filters.range}
            onChange={(event) => set({ range: event.target.value })}
            className="hidden w-40 md:block"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'pointer-events-none',
              )}
            >
              <Radio className="size-3.5 text-success" aria-hidden />
              Live
            </span>
            <span
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'pointer-events-none gap-1.5 opacity-70',
              )}
            >
              <Download className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Export</span>
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-2xs tracking-wide text-ink-500 uppercase">
                Soon
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono text-ink-600">Saved</span>
          {savedSearches.map((saved) => (
            <button
              key={saved.label}
              type="button"
              onClick={() =>
                set({
                  search: saved.filters.search,
                  level: saved.filters.level,
                  environment: saved.filters.environment,
                  range: saved.filters.range,
                })
              }
              className="cursor-pointer rounded-full border border-border bg-white/2 px-2.5 py-1 font-mono text-2xs text-ink-400 transition-colors duration-150 hover:border-iris-500/40 hover:text-iris-200"
            >
              {saved.label}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card overflow-hidden rounded-xl">
        {rows.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-ink-100">
              No logs match your filters
            </p>
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className="mt-2 cursor-pointer text-sm text-iris-300 transition-colors hover:text-iris-200"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th className="w-28">Time</Th>
                  <Th className="w-24">Level</Th>
                  <Th>Message</Th>
                  <Th className="hidden w-28 sm:table-cell">Env</Th>
                  <Th className="hidden w-20 text-right md:table-cell">
                    Latency
                  </Th>
                </tr>
              </THead>
              <TBody>
                {rows.map((log) => (
                  <Tr key={log.id} interactive>
                    <Td className="font-mono text-xs whitespace-nowrap text-ink-500">
                      {log.time}
                    </Td>
                    <Td>
                      <LevelBadge level={log.level} />
                    </Td>
                    <Td className="max-w-0 truncate font-mono text-xs text-ink-100">
                      {log.message}
                    </Td>
                    <Td className="hidden font-mono text-xs text-ink-500 sm:table-cell">
                      {log.environment}
                    </Td>
                    <Td className="hidden text-right font-mono text-xs text-ink-500 md:table-cell">
                      {log.latencyMs !== undefined
                        ? `${log.latencyMs}ms`
                        : '—'}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2.5 font-mono text-2xs text-ink-500">
              <span>
                {rows.length} events ·{' '}
                <span className="text-ink-300">12,847 in last 24h</span> ·
                sorted by <span className="text-ink-300">timestamp desc</span>
              </span>
              <span className="hidden sm:inline">
                limit {LOGS_LIMIT} · retention 30d
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
