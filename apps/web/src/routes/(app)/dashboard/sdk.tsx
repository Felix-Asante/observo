import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Copy, ExternalLink, KeyRound } from 'lucide-react'
import { Button, Card, CodeWindow, cn } from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'
import { NODE_SDK_DOCS_URL, sdkTabs } from '#/data/dashboard/sdk'
import { serverApiUrl } from '#/lib/api-url'

export const Route = createFileRoute('/(app)/dashboard/sdk')({
  head: () => ({ meta: [{ title: 'SDK setup · Observo' }] }),
  component: SdkPage,
})

function SdkPage() {
  const [activeId, setActiveId] = useState(sdkTabs[0].id)
  const [copied, setCopied] = useState<string | null>(null)
  const active = sdkTabs.find((tab) => tab.id === activeId) ?? sdkTabs[0]
  const envExample = `OBSERVO_API_KEY=OBV:your-key-id:your-secret\nOBSERVO_HOST=${serverApiUrl}`

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
                'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors duration-150',
                tab.id === activeId
                  ? 'bg-iris-500/10 font-medium text-iris-200'
                  : 'text-ink-400 hover:bg-white/4 hover:text-ink-100',
              )}
            >
              {tab.label}
              {tab.comingSoon ? (
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-2xs tracking-wide text-ink-500 uppercase">
                  Soon
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {active.comingSoon ? (
          <Card className="flex min-h-70 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="rounded border border-border px-2 py-1 font-mono text-2xs tracking-wide text-ink-500 uppercase">
              Coming soon
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-ink-400">
              The {active.label} SDK is on the way. Use the Node.js SDK for now
              — it works in most server-side {active.label} runtimes too.
            </p>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => setActiveId('node')}
            >
              View Node.js setup
            </Button>
            <a
              href={NODE_SDK_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-iris-300 transition-colors hover:text-iris-200"
            >
              Node.js docs on npm
              <ExternalLink
                className="ml-1 inline size-3.5 align-text-bottom"
                aria-hidden
              />
            </a>
          </Card>
        ) : (
          <div className="space-y-4">
            <CodeWindow title={active.install ?? ''}>
              <div className="relative">
                <pre className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-7 text-ink-100">
                  <code>{active.install}</code>
                </pre>
                <button
                  type="button"
                  onClick={() => copy(active.install ?? '', 'install')}
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
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="label-mono text-ink-600">Environment variables</p>
                <button
                  type="button"
                  onClick={() => copy(envExample, 'env')}
                  aria-label="Copy environment variables"
                  className="cursor-pointer rounded-md p-1.5 text-ink-400 transition-colors hover:bg-white/6 hover:text-ink-100"
                >
                  {copied === 'env' ? (
                    <Check className="size-3.5 text-success" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto font-mono text-[0.8125rem] leading-7 text-ink-100">
                <code>{envExample}</code>
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Use your API key from{' '}
                <Link
                  to="/dashboard/api-keys"
                  className="text-iris-300 transition-colors hover:text-iris-200"
                >
                  API keys
                </Link>
                . <code className="font-mono text-ink-300">OBSERVO_HOST</code>{' '}
                is your Observo ingest base URL (includes{' '}
                <code className="font-mono text-ink-300">/api/v1</code>).
              </p>
            </Card>

            <Card className="p-5">
              <p className="label-mono mb-3 text-ink-600">Initialize</p>
              <pre className="overflow-x-auto font-mono text-[0.8125rem] leading-7 text-ink-100">
                <code>{active.init}</code>
              </pre>
            </Card>

            {active.example ? (
              <Card className="p-5">
                <p className="label-mono mb-3 text-ink-600">
                  Send your first log
                </p>
                <pre className="overflow-x-auto font-mono text-[0.8125rem] leading-7 text-ink-100">
                  <code>{active.example}</code>
                </pre>
              </Card>
            ) : null}

            <p className="text-xs leading-relaxed text-ink-500">
              Batching and background flush are handled by the SDK. After
              sending a log, check{' '}
              <Link
                to="/dashboard/logs"
                className="text-iris-300 transition-colors hover:text-iris-200"
              >
                Logs
              </Link>{' '}
              or{' '}
              <Link
                to="/dashboard/live"
                className="text-iris-300 transition-colors hover:text-iris-200"
              >
                Live tail
              </Link>
              .
            </p>

            {active.docsUrl ? (
              <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="label-mono text-ink-600">Documentation</p>
                  <p className="mt-1 text-sm text-ink-400">
                    Configuration, log fields, advanced setup, and
                    troubleshooting on npm.
                  </p>
                </div>
                <a
                  href={active.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button size="sm" variant="secondary">
                    <ExternalLink className="size-3.5" aria-hidden />
                    Read on npm
                  </Button>
                </a>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </>
  )
}
