import { AlertTriangle, Bell, KeyRound, Rocket } from 'lucide-react'
import { Dropdown, cn } from '@observo/ui'

const notifications = [
  {
    id: 'ntf_1',
    icon: AlertTriangle,
    iconClass: 'text-warning bg-warning/10',
    title: 'High error rate on payments',
    detail: 'error rate 1.4% > 1% for 5m',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'ntf_2',
    icon: Rocket,
    iconClass: 'text-success bg-success/10',
    title: 'Deploy 4e12af9 completed',
    detail: 'api · production · 6/6 instances',
    time: '38m ago',
    unread: true,
  },
  {
    id: 'ntf_3',
    icon: KeyRound,
    iconClass: 'text-iris-300 bg-iris-500/10',
    title: 'API key regenerated',
    detail: 'OBV:4fa2… by maya@arcline.dev',
    time: '1h ago',
    unread: false,
  },
] as const

export function Notifications() {
  return (
    <Dropdown
      buttonAriaLabel="Open notifications"
      buttonClassName="relative flex size-8 items-center justify-center rounded-lg text-ink-400 transition-colors duration-200 hover:bg-white/[0.05] hover:text-ink-100"
      button={
        <>
          <Bell className="size-4" aria-hidden />
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-iris-400"
          />
          <span className="sr-only">2 unread notifications</span>
        </>
      }
      menuClassName="w-80 p-0"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <p className="text-sm font-medium text-ink-50">Notifications</p>
        <span className="font-mono text-2xs text-ink-500">2 unread</span>
      </div>
      <ul className="max-h-80 overflow-y-auto p-1.5">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-start gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.04]"
            >
              <span
                aria-hidden
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-md',
                  notification.iconClass,
                )}
              >
                <notification.icon className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink-100">
                  {notification.title}
                </span>
                <span className="block truncate font-mono text-2xs text-ink-500">
                  {notification.detail}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="text-2xs text-ink-600">
                  {notification.time}
                </span>
                {notification.unread ? (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-iris-400"
                  />
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}
