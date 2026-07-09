import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { Button, Card, StatusDot, cn } from '@observo/ui'

import { LogDrawer } from '#/components/dashboard/logs/log-drawer'
import { LevelBadge } from '#/components/dashboard/shared/level-badge'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { logEvents } from '#/data/dashboard/logs'
import type { LogEvent } from '#/data/dashboard/types'

export const Route = createFileRoute('/(app)/dashboard/live')({
  head: () => ({ meta: [{ title: 'Live tail · Observo' }] }),
  component: LiveTailPage,
})

function LiveTailPage() {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<LogEvent | null>(null)

  return (
    <>
      <PageHeader
        title="Live tail"
        description="Events stream here the moment they hit the ingest pipeline — no refresh, no delay."
        actions={
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
        }
      />

      <Card className="overflow-hidden">
        {/* Stream header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <StatusDot tone={paused ? 'muted' : 'success'} pulse={!paused} />
            <span className="font-mono text-2xs text-ink-400">
              {paused ? 'stream paused' : 'connected · logs.ingest'}
            </span>
          </div>
          <span className="font-mono text-2xs text-ink-600">
            filters: none · all environments
          </span>
        </div>

        {/* Stream */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Live log stream"
          className={cn(
            'divide-y divide-border-subtle/50',
            paused && 'opacity-60',
          )}
        >
          {logEvents.map((log, index) => (
            <motion.button
              key={log.id}
              type="button"
              onClick={() => setSelected(log)}
              initial={reducedMotion ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid w-full cursor-pointer grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-4 py-2 text-left font-mono text-xs transition-colors duration-100 hover:bg-white/[0.025]"
            >
              <span className="whitespace-nowrap text-ink-600">{log.time}</span>
              <LevelBadge level={log.level} />
              <span className="truncate text-ink-100">{log.message}</span>
              <span className="hidden text-ink-500 sm:block">
                {log.appName}·{log.environment.slice(0, 4)}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="border-t border-border-subtle px-4 py-2.5 font-mono text-2xs text-ink-600">
          showing last {logEvents.length} events · new events appear at the top
        </div>
      </Card>

      <LogDrawer log={selected} onClose={() => setSelected(null)} />
    </>
  )
}
