import { Download, Radio, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Select, buttonVariants, cn } from '@observo/ui'

import { savedSearches, timeRanges } from '#/data/dashboard/logs'
import type { LogLevel } from '#/data/dashboard/types'

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

export type LogFilters = {
  search: string
  level: string
  app: string
  environment: string
  range: string
}

type FilterBarProps = {
  filters: LogFilters
  onChange: (filters: LogFilters) => void
  disabled?: boolean
}

export function FilterBar({ filters, onChange, disabled }: FilterBarProps) {
  const set = (patch: Partial<LogFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-56 flex-1">
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
            disabled={disabled}
            className="h-9 w-full rounded-lg border border-border bg-white/[0.02] pr-3 pl-9 font-mono text-xs text-ink-100 transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-ink-600 hover:border-border-strong focus:border-iris-400/60 focus:shadow-[0_0_0_3px_var(--glow-iris-soft)] disabled:opacity-60"
          />
        </div>

        <Select
          label="Level"
          hideLabel
          value={filters.level}
          onChange={(event) => set({ level: event.target.value })}
          className="w-30"
          disabled={disabled}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level === 'all' ? 'All levels' : level}
            </option>
          ))}
        </Select>

        {/* <Select
          label="Application"
          hideLabel
          value={filters.app}
          onChange={(event) => set({ app: event.target.value })}
          className="w-32"
          disabled={disabled}
        >
          <option value="all">All apps</option>
          {logApps.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </Select> */}

        <Select
          label="Environment"
          hideLabel
          value={filters.environment}
          onChange={(event) => set({ environment: event.target.value })}
          className="w-34"
          disabled={disabled}
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
          className="w-40"
          disabled={disabled}
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/dashboard/live"
            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
          >
            <Radio className="size-3.5 text-success" aria-hidden />
            Live
          </Link>
          <button
            type="button"
            disabled
            aria-label="Export logs (coming soon)"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'gap-1.5 disabled:opacity-70',
            )}
          >
            <Download className="size-3.5" aria-hidden />
            Export
            <span className="rounded border border-border px-1.5 py-0.5 font-mono text-2xs tracking-wide text-ink-500 uppercase">
              Soon
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="label-mono text-ink-600">Saved</span>
        {savedSearches.map((saved) => (
          <button
            key={saved.label}
            type="button"
            disabled={disabled}
            onClick={() => set(saved.filters)}
            className="cursor-pointer rounded-full border border-border bg-white/2 px-2.5 py-1 font-mono text-2xs text-ink-400 transition-colors duration-150 hover:border-iris-500/40 hover:text-iris-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saved.label}
          </button>
        ))}
      </div>
    </div>
  )
}
