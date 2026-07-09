import { cn } from '@observo/ui'

import type { LogImportance, LogLevel } from '#/data/dashboard/types'

const levelClasses: Record<LogLevel, string> = {
  info: 'text-info bg-info/10 border-info/20',
  error: 'text-error bg-error/10 border-error/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  debug: 'text-ink-400 bg-white/[0.04] border-border',
  trace: 'text-chart-2 bg-chart-2/10 border-chart-2/20',
  audit: 'text-chart-4 bg-chart-4/10 border-chart-4/20',
  success: 'text-success bg-success/10 border-success/20',
}

export function LevelBadge({
  level,
  className,
}: {
  level: LogLevel
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase',
        levelClasses[level],
        className,
      )}
    >
      {level}
    </span>
  )
}

const importanceClasses: Record<LogImportance, string> = {
  critical: 'text-error bg-error/10 border-error/25',
  high: 'text-warning bg-warning/10 border-warning/20',
  medium: 'text-info bg-info/10 border-info/20',
  low: 'text-ink-400 bg-white/[0.04] border-border',
}

export function ImportanceBadge({
  importance,
  className,
}: {
  importance: LogImportance
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-2xs font-semibold uppercase',
        importanceClasses[importance],
        className,
      )}
    >
      {importance}
    </span>
  )
}
