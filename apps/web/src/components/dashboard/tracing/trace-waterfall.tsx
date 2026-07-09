import { cn } from '@observo/ui'

import type { TraceSpan } from '#/data/dashboard/tracing'

const statusColors = {
  ok: 'bg-chart-5',
  error: 'bg-error',
  timeout: 'bg-warning',
} as const

type TraceWaterfallProps = {
  trace: TraceSpan
  totalMs: number
  className?: string
}

function SpanRow({
  span,
  depth,
  totalMs,
}: {
  span: TraceSpan
  depth: number
  totalMs: number
}) {
  const leftPct = (span.startMs / totalMs) * 100
  const widthPct = Math.max((span.durationMs / totalMs) * 100, 0.8)

  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-3 py-1.5"
        style={{ paddingLeft: depth * 16 }}
      >
        <div className="min-w-0 truncate font-mono text-xs text-ink-200">
          {span.name}
        </div>
        <div className="relative h-5">
          <div
            className={cn(
              'absolute inset-y-0 rounded-sm opacity-85',
              statusColors[span.status],
            )}
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
          />
        </div>
        <span className="font-mono text-2xs whitespace-nowrap text-ink-500">
          {span.durationMs}ms
        </span>
      </div>
      {span.children?.map((child) => (
        <SpanRow
          key={child.id}
          span={child}
          depth={depth + 1}
          totalMs={totalMs}
        />
      ))}
    </>
  )
}

/** Flattened waterfall visualization for a distributed trace. */
export function TraceWaterfall({
  trace,
  totalMs,
  className,
}: TraceWaterfallProps) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] gap-3 px-0">
        <span className="label-mono text-ink-600">Operation</span>
        <span className="label-mono text-ink-600">Timeline</span>
        <span className="label-mono text-right text-ink-600">Duration</span>
      </div>
      <SpanRow span={trace} depth={0} totalMs={totalMs} />
    </div>
  )
}
