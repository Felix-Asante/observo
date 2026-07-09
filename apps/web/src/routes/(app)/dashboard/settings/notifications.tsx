import { createFileRoute } from '@tanstack/react-router'
import { Switch } from '@observo/ui'

import { SettingsCard } from '#/components/dashboard/settings/settings-card'

export const Route = createFileRoute('/(app)/dashboard/settings/notifications')(
  {
    head: () => ({ meta: [{ title: 'Notification settings · Observo' }] }),
    component: NotificationSettingsPage,
  },
)

const alertPreferences = [
  {
    id: 'critical',
    label: 'Critical alerts',
    description:
      'Rules with critical severity always notify — this cannot be disabled.',
    defaultChecked: true,
    disabled: true,
  },
  {
    id: 'alerts',
    label: 'Alert notifications',
    description: 'When any enabled alert rule triggers or recovers.',
    defaultChecked: true,
  },
  {
    id: 'quota',
    label: 'Quota warnings',
    description: 'When monthly ingest passes 80% and 100% of your plan.',
    defaultChecked: true,
  },
] as const

const digestPreferences = [
  {
    id: 'weekly',
    label: 'Weekly digest',
    description: 'Volume, error trends, and top issues — every Monday morning.',
    defaultChecked: true,
  },
  {
    id: 'product',
    label: 'Product updates',
    description: 'New features and changelog highlights, about once a month.',
    defaultChecked: false,
  },
] as const

function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Alerts"
        description="Email notifications about your system's health."
      >
        <div className="space-y-5">
          {alertPreferences.map((preference) => (
            <Switch
              key={preference.id}
              label={preference.label}
              description={preference.description}
              defaultChecked={preference.defaultChecked}
              disabled={
                'disabled' in preference ? preference.disabled : undefined
              }
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Digests" description="Periodic summaries, no noise.">
        <div className="space-y-5">
          {digestPreferences.map((preference) => (
            <Switch
              key={preference.id}
              label={preference.label}
              description={preference.description}
              defaultChecked={preference.defaultChecked}
            />
          ))}
        </div>
      </SettingsCard>
    </div>
  )
}
