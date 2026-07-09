import { useState } from 'react'
import { Check, Copy, ExternalLink, X } from 'lucide-react'
import { Drawer } from '@observo/ui'

import { JsonViewer } from '#/components/dashboard/shared/json-viewer'
import {
  ImportanceBadge,
  LevelBadge,
} from '#/components/dashboard/shared/level-badge'
import type { LogEvent } from '#/data/dashboard/types'

type LogDrawerProps = {
  log: LogEvent | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-mono text-ink-600">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-ink-200">{value}</dd>
    </div>
  )
}

export function LogDrawer({ log, onClose }: LogDrawerProps) {
  const [copied, setCopied] = useState(false)

  const copyPayload = () => {
    if (!log) return
    void navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Drawer open={log !== null} onClose={onClose} label="Log details">
      {log ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-5">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <LevelBadge level={log.level} />
                {log.importance ? (
                  <ImportanceBadge importance={log.importance} />
                ) : null}
              </div>
              <p className="font-mono text-sm leading-relaxed break-words text-ink-50">
                {log.message}
              </p>
              <p className="mt-1.5 font-mono text-2xs text-ink-500">
                {log.date} · {log.time} · {log.id}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close log details"
              className="cursor-pointer rounded-md p-1.5 text-ink-400 transition-colors hover:bg-white/[0.05] hover:text-ink-100"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Metadata */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              <Field label="Application" value={log.appName} />
              <Field label="Environment" value={log.environment} />
              {log.operation ? (
                <Field label="Operation" value={log.operation} />
              ) : null}
              {log.subsystem ? (
                <Field label="Subsystem" value={log.subsystem} />
              ) : null}
              {log.latencyMs !== undefined ? (
                <Field label="Latency" value={`${log.latencyMs}ms`} />
              ) : null}
              {log.dbQueryCount !== undefined ? (
                <Field label="DB queries" value={String(log.dbQueryCount)} />
              ) : null}
            </dl>

            {/* Trace */}
            {log.traceId ? (
              <div className="surface-inset flex items-center justify-between gap-3 rounded-lg px-4 py-3">
                <div>
                  <p className="label-mono text-ink-600">Trace</p>
                  <p className="mt-1 font-mono text-xs text-iris-300">
                    {log.traceId}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-iris-200"
                >
                  View trace
                  <ExternalLink className="size-3" aria-hidden />
                </button>
              </div>
            ) : null}

            {/* Payload */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="label-mono text-ink-600">Payload</p>
                <button
                  type="button"
                  onClick={copyPayload}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-ink-100"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-success" aria-hidden />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" aria-hidden />
                      Copy JSON
                    </>
                  )}
                </button>
              </div>
              <JsonViewer value={log.payload} />
            </div>
          </div>
        </>
      ) : null}
    </Drawer>
  )
}
