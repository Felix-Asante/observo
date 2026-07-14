import { Activity, BookOpen, KeyRound, Radio, ScrollText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  /** Exact path match for active state (index routes). */
  exact?: boolean
}

export type NavSection = {
  label: string
  items: Array<NavItem>
}

export const navSections: Array<NavSection> = [
  {
    label: 'Observability',
    items: [
      { label: 'Overview', to: '/dashboard', icon: Activity, exact: true },
      { label: 'Logs', to: '/dashboard/logs', icon: ScrollText },
      { label: 'Live tail', to: '/dashboard/live', icon: Radio },
    ],
  },
  {
    label: 'Configure',
    items: [
      { label: 'API keys', to: '/dashboard/api-keys', icon: KeyRound },
      { label: 'SDK setup', to: '/dashboard/sdk', icon: BookOpen },
    ],
  },
]

/** Breadcrumb labels by path segment. */
export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  logs: 'Logs',
  live: 'Live tail',
  'api-keys': 'API keys',
  sdk: 'SDK setup',
}
