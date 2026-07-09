import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, Switch } from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'
import { integrations } from '#/data/dashboard/integrations'

export const Route = createFileRoute('/(app)/dashboard/integrations')({
  head: () => ({ meta: [{ title: 'Integrations · Observo' }] }),
  component: IntegrationsPage,
})

function IntegrationCard({
  integration,
}: {
  integration: (typeof integrations)[number]
}) {
  const [connected, setConnected] = useState(integration.connected)

  return (
    <Card className="flex flex-wrap items-start gap-4 p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-iris-300">
        <integration.icon className="size-4.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-sm font-medium text-ink-50">
            {integration.name}
          </h2>
          <Badge variant={connected ? 'success' : 'neutral'} size="sm">
            {connected ? 'Connected' : 'Not connected'}
          </Badge>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
          {integration.description}
        </p>
        {connected && integration.detail ? (
          <p className="mt-2 font-mono text-2xs text-ink-500">
            {integration.detail}
          </p>
        ) : null}
      </div>
      <Switch
        checked={connected}
        onChange={(event) => setConnected(event.target.checked)}
        aria-label={`${connected ? 'Disconnect' : 'Connect'} ${integration.name}`}
      />
    </Card>
  )
}

function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect Observo to the tools your team already uses for alerts and incident response."
        actions={
          <Button variant="secondary" size="sm">
            <Plus className="size-3.5" aria-hidden />
            Add integration
          </Button>
        }
      />

      <div className="space-y-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </>
  )
}
