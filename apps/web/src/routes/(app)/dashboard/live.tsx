import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Pause, Play, RefreshCw } from 'lucide-react'
import { Button, Card, StatusDot, cn } from '@observo/ui'

import { LogDrawer } from '#/components/dashboard/logs/log-drawer'
import { LevelBadge } from '#/components/dashboard/shared/level-badge'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { useLiveLogs } from '#/hooks/use-live-logs'
import type { LogEvent } from '#/data/dashboard/types'

export const Route = createFileRoute('/(app)/dashboard/live')({
  head: () => ({ meta: [{ title: 'Live tail · Observo' }] }),
  component: LiveTailPage,
})

function statusLabel(
  status: ReturnType<typeof useLiveLogs>['status'],
  paused: boolean,
): string {
  if (paused) return 'stream paused'
  switch (status) {
    case 'connecting':
      return 'connecting…'
    case 'reconnecting':
      return 'reconnecting…'
    case 'connected':
      return 'connected · logs.ingest'
    case 'error':
      return 'disconnected'
    default:
      return 'idle'
  }
}

function statusTone(
  status: ReturnType<typeof useLiveLogs>['status'],
  paused: boolean,
): 'success' | 'warning' | 'error' | 'muted' {
  if (paused) return 'muted'
  if (status === 'connected') return 'success'
  if (status === 'error') return 'error'
  if (status === 'reconnecting' || status === 'connecting') return 'warning'
  return 'muted'
}

function LiveTailPage() {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<LogEvent | null>(null)

  const filters = useMemo(() => ({ limit: 100 }), [])
  const { logs, status, error, clear } = useLiveLogs({
    paused,
    filters,
  })

  const tone = statusTone(status, paused)

  return (
    <>
      <PageHeader
        title="Live tail"
        description="Events stream here the moment they hit the ingest pipeline — no refresh, no delay."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              disabled={logs.length === 0}
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Clear
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
            >
              {paused ? (
                <>
                  <Play className="size-3.5" aria-hidden />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="size-3.5" aria-hidden />
                  Pause
                </>
              )}
            </Button>
          </div>
        }
      />

      {error && status === 'error' ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-lg border border-error/30 bg-error/6 px-4 py-3"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-error"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-ink-300">{error}</p>
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <StatusDot tone={tone} pulse={!paused && status === 'connected'} />
            <span className="font-mono text-2xs text-ink-400">
              {statusLabel(status, paused)}
            </span>
          </div>
          <span className="font-mono text-2xs text-ink-600">
            filters: none · all environments
          </span>
        </div>

        <div
          role="log"
          aria-live="polite"
          aria-label="Live log stream"
          className={cn(
            'divide-y divide-border-subtle/50',
            paused && 'opacity-60',
          )}
        >
          {logs.length === 0 ? (
            <div className="px-4 py-10 text-center font-mono text-xs text-ink-500">
              {status === 'connecting' || status === 'reconnecting'
                ? 'Waiting for events…'
                : 'No events yet. Send logs from the SDK to see them stream in.'}
            </div>
          ) : (
            logs.map((log, index) => (
              <motion.button
                key={log.id}
                type="button"
                onClick={() => setSelected(log)}
                initial={
                  reducedMotion || index > 20 ? false : { opacity: 0, x: -6 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid w-full cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-4 py-2 text-left font-mono text-xs transition-colors duration-100 hover:bg-white/[0.025]"
              >
                <span className="whitespace-nowrap text-ink-600">
                  {log.time}
                </span>
                <LevelBadge level={log.level} />
                <span className="truncate text-ink-100">{log.message}</span>
                <span className="hidden text-ink-500 sm:block">
                  {log.appName}·{log.environment.slice(0, 4)}
                </span>
              </motion.button>
            ))
          )}
        </div>

        <div className="border-t border-border-subtle px-4 py-2.5 font-mono text-2xs text-ink-600">
          showing last {logs.length} events · new events appear at the top
        </div>
      </Card>

      <LogDrawer log={selected} onClose={() => setSelected(null)} />
    </>
  )
}
