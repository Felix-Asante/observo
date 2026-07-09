import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Copy, KeyRound } from 'lucide-react'
import { Button, Card, CodeWindow, cn } from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'
import { sdkTabs } from '#/data/dashboard/sdk'

export const Route = createFileRoute('/(app)/dashboard/sdk')({
  head: () => ({ meta: [{ title: 'SDK setup · Observo' }] }),
  component: SdkPage,
})

function SdkPage() {
  const [activeId, setActiveId] = useState(sdkTabs[0].id)
  const [copied, setCopied] = useState<string | null>(null)
  const active = sdkTabs.find((tab) => tab.id === activeId) ?? sdkTabs[0]

  const copy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1600)
  }

  return (
    <>
      <PageHeader
        title="SDK setup"
        description="Install the SDK, set your API key, and ship your first structured log in under a minute."
        actions={
          <Link to="/dashboard/api-keys">
            <Button size="sm">
              <KeyRound className="size-3.5" aria-hidden />
              Get API key
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav
          aria-label="SDK languages"
          className="flex flex-row gap-1 overflow-x-auto lg:flex-col"
        >
          {sdkTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={cn(
                'cursor-pointer rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors duration-150',
                tab.id === activeId
                  ? 'bg-iris-500/10 font-medium text-iris-200'
                  : 'text-ink-400 hover:bg-white/[0.04] hover:text-ink-100',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          <CodeWindow title={active.install}>
            <div className="relative">
              <pre className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-7 text-ink-100">
                <code>{active.install}</code>
              </pre>
              <button
                type="button"
                onClick={() => copy(active.install, 'install')}
                aria-label="Copy install command"
                className="absolute top-3 right-3 cursor-pointer rounded-md p-1.5 text-ink-400 transition-colors hover:bg-white/[0.06] hover:text-ink-100"
              >
                {copied === 'install' ? (
                  <Check className="size-3.5 text-success" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
              </button>
            </div>
          </CodeWindow>

          <Card className="p-5">
            <p className="label-mono mb-3 text-ink-600">Initialize</p>
            <pre className="overflow-x-auto font-mono text-[0.8125rem] leading-7 text-ink-100">
              <code>{active.init}</code>
            </pre>
          </Card>

          <Card className="p-5">
            <p className="label-mono mb-3 text-ink-600">Send your first log</p>
            <pre className="overflow-x-auto font-mono text-[0.8125rem] leading-7 text-ink-100">
              <code>{active.example}</code>
            </pre>
          </Card>

          <p className="text-xs leading-relaxed text-ink-500">
            Events are sent to{' '}
            <code className="font-mono text-ink-300">
              POST /api/v1/logs/send
            </code>{' '}
            with the <code className="font-mono text-iris-300">x-api-key</code>{' '}
            header. Batching, retries, and backpressure are handled by the SDK.
          </p>
        </div>
      </div>
    </>
  )
}
