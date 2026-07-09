import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Mail, MessageSquare, Plus, Webhook } from 'lucide-react'
import {
  Button,
  Card,
  Dialog,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Switch,
  cn,
} from '@observo/ui'

import { ImportanceBadge } from '#/components/dashboard/shared/level-badge'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { alertRules } from '#/data/dashboard/alerts'
import type { AlertRule } from '#/data/dashboard/types'

export const Route = createFileRoute('/(app)/dashboard/alerts')({
  head: () => ({ meta: [{ title: 'Alerts · Observo' }] }),
  component: AlertsPage,
})

const channelConfig = {
  slack: { icon: MessageSquare, label: 'Slack' },
  webhook: { icon: Webhook, label: 'Webhook' },
  email: { icon: Mail, label: 'Email' },
} as const

function AlertRuleCard({ rule }: { rule: AlertRule }) {
  const [enabled, setEnabled] = useState(rule.enabled)

  return (
    <Card
      className={cn(
        'flex flex-wrap items-center gap-4 px-5 py-4 transition-opacity duration-200',
        !enabled && 'opacity-55',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-sm font-medium text-ink-50">{rule.name}</h2>
          <ImportanceBadge importance={rule.severity} />
        </div>
        <p className="mt-1.5 font-mono text-xs text-ink-400">
          <span className="text-iris-300">{rule.query}</span>
          {' · '}
          {rule.condition}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {rule.channels.map((channel) => {
            const config = channelConfig[channel]
            return (
              <span
                key={channel}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.02] px-2 py-0.5 text-2xs text-ink-400"
              >
                <config.icon className="size-3" aria-hidden />
                {config.label}
              </span>
            )
          })}
          <span className="font-mono text-2xs text-ink-600">
            {rule.lastTriggered
              ? `last triggered ${rule.lastTriggered}`
              : 'never triggered'}
          </span>
        </div>
      </div>
      <Switch
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
        aria-label={`${enabled ? 'Disable' : 'Enable'} ${rule.name}`}
      />
    </Card>
  )
}

function AlertsPage() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Alerts"
        description="Notification rules that watch your log stream and page the right channel when thresholds break."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-3.5" aria-hidden />
            New alert
          </Button>
        }
      />

      <div className="space-y-3">
        {alertRules.map((rule) => (
          <AlertRuleCard key={rule.id} rule={rule} />
        ))}
      </div>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        label="Create alert rule"
        className="max-w-lg"
      >
        <DialogHeader
          title="Create alert rule"
          description="Define a query and a threshold — Observo evaluates it continuously against the live stream."
        />
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setCreateOpen(false)
          }}
        >
          <div className="space-y-5 px-6 py-5">
            <Input
              label="Name"
              name="name"
              placeholder="High error rate"
              required
            />
            <Input
              label="Query"
              name="query"
              placeholder="level:error env:production"
              className="font-mono"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Severity" name="severity" defaultValue="high">
                <option value="critical">critical</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </Select>
              <Select label="Channel" name="channel" defaultValue="slack">
                <option value="slack">Slack</option>
                <option value="webhook">Webhook</option>
                <option value="email">Email</option>
              </Select>
            </div>
            <Input
              label="Condition"
              name="condition"
              placeholder="count > 20 in 10m"
              className="font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create rule
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
