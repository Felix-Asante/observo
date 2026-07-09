import { createFileRoute } from '@tanstack/react-router'
import { Laptop, Smartphone } from 'lucide-react'
import { Badge, Button, PasswordInput } from '@observo/ui'

import { SettingsCard } from '#/components/dashboard/settings/settings-card'

export const Route = createFileRoute('/(app)/dashboard/settings/security')({
  head: () => ({ meta: [{ title: 'Security settings · Observo' }] }),
  component: SecuritySettingsPage,
})

const sessions = [
  {
    id: 'ses_1',
    icon: Laptop,
    device: 'MacBook Pro · Chrome 126',
    location: 'Stockholm, SE · 84.22.101.9',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 'ses_2',
    icon: Smartphone,
    device: 'iPhone · Safari',
    location: 'Stockholm, SE · 84.22.101.9',
    lastActive: '2 days ago',
    current: false,
  },
] as const

function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Change password"
        description="Use a long, unique password. Changing it signs out all other sessions."
        footer={
          <Button size="sm" type="submit" form="password-form">
            Update password
          </Button>
        }
      >
        {/* Better Auth default change-password endpoint */}
        <form
          id="password-form"
          method="POST"
          action="/api/auth/change-password"
          className="space-y-5"
        >
          <PasswordInput
            label="Current password"
            name="currentPassword"
            autoComplete="current-password"
            required
          />
          <PasswordInput
            label="New password"
            name="newPassword"
            autoComplete="new-password"
            required
          />
        </form>
      </SettingsCard>

      <SettingsCard
        title="Active sessions"
        description="Devices currently signed in to your account."
      >
        <ul className="divide-y divide-border-subtle">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-ink-400"
              >
                <session.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm text-ink-100">
                  {session.device}
                  {session.current ? (
                    <Badge variant="iris" size="sm">
                      This device
                    </Badge>
                  ) : null}
                </p>
                <p className="mt-0.5 truncate font-mono text-2xs text-ink-500">
                  {session.location} · {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsCard>
    </div>
  )
}
