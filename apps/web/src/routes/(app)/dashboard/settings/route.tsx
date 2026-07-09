import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { Bell, ShieldCheck, UserRound } from 'lucide-react'
import { cn } from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'

export const Route = createFileRoute('/(app)/dashboard/settings')({
  head: () => ({ meta: [{ title: 'Settings · Observo' }] }),
  component: SettingsLayout,
})

const settingsNav = [
  { label: 'General', to: '/dashboard/settings', icon: UserRound, exact: true },
  {
    label: 'Security',
    to: '/dashboard/settings/security',
    icon: ShieldCheck,
    exact: false,
  },
  {
    label: 'Notifications',
    to: '/dashboard/settings/notifications',
    icon: Bell,
    exact: false,
  },
] as const

function SettingsLayout() {
  const { pathname } = useLocation()

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your account, security, and notification preferences."
      />
      <div className="flex flex-col gap-8 lg:flex-row">
        <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {settingsNav.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors duration-150',
                      active
                        ? 'bg-iris-500/10 font-medium text-iris-200'
                        : 'text-ink-400 hover:bg-white/[0.04] hover:text-ink-100',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'size-4',
                        active ? 'text-iris-400' : 'text-ink-500',
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="min-w-0 max-w-2xl flex-1">
          <Outlet />
        </div>
      </div>
    </>
  )
}
