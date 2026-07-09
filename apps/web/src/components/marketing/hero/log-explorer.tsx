import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Search } from 'lucide-react'
import { CodeWindow, Kbd, StatusDot, cn } from '@observo/ui'

import { heroLogLines } from '#/data/content'
import type { HeroLogLine } from '#/data/content'

const VISIBLE_LINES = 6

const levelClass: Record<HeroLogLine['level'], string> = {
  debug: 'log-debug',
  info: 'log-info',
  warn: 'log-warn',
  error: 'log-error',
}

function Sparkline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 28"
      fill="none"
      aria-hidden
      className={cn('h-7 w-24', className)}
    >
      <path
        d="M1 22c6-2 8-9 14-9s7 5 12 5 8-13 14-13 7 8 12 8 8-4 13-4 9 9 14 9 10-6 15-8"
        stroke="var(--color-chart-1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1 22c6-2 8-9 14-9s7 5 12 5 8-13 14-13 7 8 12 8 8-4 13-4 9 9 14 9 10-6 15-8V28H1z"
        fill="url(#spark-fill)"
        opacity="0.25"
      />
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--color-chart-1)" />
          <stop offset="1" stopColor="var(--color-chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * The hero product preview: a live log explorer with a search bar,
 * stat row, and an animated tail of incoming events.
 */
export function LogExplorer() {
  const reducedMotion = useReducedMotion()
  const [cursor, setCursor] = useState(VISIBLE_LINES)

  useEffect(() => {
    if (reducedMotion) return
    const interval = window.setInterval(() => {
      setCursor((current) => current + 1)
    }, 2200)
    return () => window.clearInterval(interval)
  }, [reducedMotion])

  const lines = Array.from({ length: VISIBLE_LINES }, (_, i) => {
    const index =
      (cursor - VISIBLE_LINES + i + heroLogLines.length * 100) %
      heroLogLines.length
    return { line: heroLogLines[index], key: cursor - VISIBLE_LINES + i }
  })

  return (
    <CodeWindow
      title="observo — production"
      actions={
        <span className="flex items-center gap-1.5 text-xs text-ink-400">
          <StatusDot tone="success" pulse />
          Live
        </span>
      }
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
        <div className="flex h-9 flex-1 items-center gap-2.5 rounded-lg border border-border bg-ink-950/70 px-3">
          <Search className="size-3.5 shrink-0 text-ink-500" aria-hidden />
          <span className="truncate font-mono text-xs text-ink-300">
            <span className="text-iris-300">level</span>:error{' '}
            <span className="text-iris-300">service</span>:payments
          </span>
          <span className="ml-auto hidden items-center gap-1 sm:flex">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </div>
        <span className="hidden shrink-0 rounded-md border border-border bg-ink-950/70 px-2.5 py-1.5 font-mono text-2xs text-ink-400 lg:block">
          us-east-1
        </span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-px border-b border-border-subtle bg-border-subtle">
        <ExplorerStat label="Errors" value="0" valueClass="text-success" />
        <ExplorerStat label="Requests" value="842/m" trend={<Sparkline />} />
        <ExplorerStat label="Avg latency" value="29ms" />
      </div>

      {/* Log tail */}
      <div
        className="h-[248px] overflow-hidden p-3 sm:p-4"
        aria-label="Live log stream"
      >
        <AnimatePresence initial={false}>
          {lines.map(({ line, key }) => (
            <motion.div
              key={key}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mb-1 flex items-baseline gap-x-3 overflow-hidden rounded-md px-2 py-1.5 font-mono text-xs whitespace-nowrap last:bg-white/[0.03] sm:text-[0.8125rem]"
            >
              <span className="shrink-0 text-ink-600">{line.time}</span>
              <span
                className={cn(
                  'w-11 shrink-0 text-2xs font-semibold uppercase',
                  levelClass[line.level],
                )}
              >
                {line.level}
              </span>
              <span className="hidden w-20 shrink-0 text-ink-500 sm:block">
                {line.service}
              </span>
              <span className="truncate text-ink-200">{line.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CodeWindow>
  )
}

function ExplorerStat({
  label,
  value,
  valueClass,
  trend,
}: {
  label: string
  value: string
  valueClass?: string
  trend?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 bg-ink-900 px-4 py-3.5">
      <div>
        <p className="text-2xs font-medium tracking-wide text-ink-500 uppercase">
          {label}
        </p>
        <p
          className={cn(
            'mt-1 text-lg font-semibold tracking-tight text-ink-50',
            valueClass,
          )}
        >
          {value}
        </p>
      </div>
      {trend ? <div className="hidden xl:block">{trend}</div> : null}
    </div>
  )
}
