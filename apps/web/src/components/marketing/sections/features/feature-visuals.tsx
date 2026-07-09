import { StatusDot, cn } from '@observo/ui'

import type { Feature } from '#/data/content'

/** Structured JSON log entry. */
function LogsVisual() {
  return (
    <pre className="surface-inset overflow-x-auto rounded-lg p-4 font-mono text-xs leading-6">
      <code>
        <span className="tok-punct">{'{'}</span>
        {'\n  '}
        <span className="tok-key">"event"</span>
        <span className="tok-punct">: </span>
        <span className="tok-str">"checkout.completed"</span>
        <span className="tok-punct">,</span>
        {'\n  '}
        <span className="tok-key">"amount"</span>
        <span className="tok-punct">: </span>
        <span className="tok-num">4200</span>
        <span className="tok-punct">,</span>
        {'\n  '}
        <span className="tok-key">"trace_id"</span>
        <span className="tok-punct">: </span>
        <span className="tok-str">"4fa2c81b"</span>
        {'\n'}
        <span className="tok-punct">{'}'}</span>
      </code>
    </pre>
  )
}

/** Query pill with results summary. */
function SearchVisual() {
  return (
    <div className="surface-inset rounded-lg p-4">
      <div className="flex items-center gap-2 rounded-md border border-border bg-ink-950/80 px-3 py-2 font-mono text-xs">
        <span className="text-iris-300">level</span>
        <span className="text-ink-500">:</span>
        <span className="text-ink-200">error</span>
        <span className="ml-2 text-iris-300">status</span>
        <span className="text-ink-500">:</span>
        <span className="text-ink-200">500</span>
        <span className="ml-auto animate-caret text-iris-400 motion-reduce:animate-none">
          ▎
        </span>
      </div>
      <p className="mt-3 font-mono text-2xs text-ink-500">
        1,284 matches · <span className="text-success">31ms</span>
      </p>
    </div>
  )
}

/** Live stream pulse rows. */
function StreamVisual() {
  return (
    <div className="surface-inset space-y-2 rounded-lg p-4">
      {[82, 64, 91].map((width, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <StatusDot tone={i === 1 ? 'iris' : 'success'} pulse={i === 0} />
          <div
            className="h-2 rounded-full bg-gradient-to-r from-ink-700 to-ink-800"
            style={{ width: `${width}%` }}
          />
        </div>
      ))}
      <p className="pt-1 font-mono text-2xs text-ink-500">
        streaming · 50k events/min
      </p>
    </div>
  )
}

/** Trace waterfall spans. */
function TraceVisual() {
  const spans = [
    { label: 'POST /checkout', left: 0, width: 100, color: 'bg-chart-1' },
    { label: 'auth.verify', left: 6, width: 14, color: 'bg-chart-2' },
    { label: 'db.query', left: 24, width: 30, color: 'bg-chart-5' },
    { label: 'stripe.charge', left: 58, width: 36, color: 'bg-chart-3' },
  ]

  return (
    <div className="surface-inset space-y-2 rounded-lg p-4">
      {spans.map((span) => (
        <div key={span.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate font-mono text-2xs text-ink-400">
            {span.label}
          </span>
          <div className="relative h-3 flex-1">
            <div
              className={cn(
                'absolute inset-y-0 rounded-sm opacity-80',
                span.color,
              )}
              style={{ left: `${span.left}%`, width: `${span.width}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Grouped error issue rows. */
function ErrorsVisual() {
  return (
    <div className="surface-inset divide-y divide-border-subtle rounded-lg">
      {[
        { name: 'TimeoutError · stripe.charge', count: '128', trend: '↑' },
        { name: 'TypeError · cart.items is null', count: '12', trend: '→' },
      ].map((issue) => (
        <div key={issue.name} className="flex items-center gap-3 px-4 py-3">
          <StatusDot tone="error" />
          <span className="flex-1 truncate font-mono text-xs text-ink-200">
            {issue.name}
          </span>
          <span className="rounded-full border border-error/20 bg-error/10 px-2 py-0.5 font-mono text-2xs text-error">
            {issue.count} {issue.trend}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Slack-style alert notification. */
function AlertsVisual() {
  return (
    <div className="surface-inset rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M7 1 1 12h12L7 1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 5.5V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="7" cy="10" r="0.75" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-100">
            Error rate above 1%
          </p>
          <p className="mt-0.5 truncate font-mono text-2xs text-ink-400">
            payments · #incidents · just now
          </p>
        </div>
      </div>
    </div>
  )
}

const visuals: Record<Feature['visual'], () => React.ReactNode> = {
  logs: LogsVisual,
  search: SearchVisual,
  stream: StreamVisual,
  trace: TraceVisual,
  errors: ErrorsVisual,
  alerts: AlertsVisual,
}

export function FeatureVisual({ visual }: { visual: Feature['visual'] }) {
  const Visual = visuals[visual]
  return <Visual />
}
