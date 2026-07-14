import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bug,
  Gauge,
  GitBranch,
  KeyRound,
  Plug,
  Radio,
  ScrollText,
  Settings,
  Shield,
  Users,
  Zap,
} from 'lucide-react'
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
      // { label: 'Errors', to: '/dashboard/errors', icon: Bug },
      // { label: 'Performance', to: '/dashboard/performance', icon: Gauge },
      // { label: 'Tracing', to: '/dashboard/tracing', icon: GitBranch },
      // { label: 'Metrics', to: '/dashboard/metrics', icon: BarChart3 },
    ],
  },
  {
    label: 'Configure',
    items: [
      // { label: 'Alerts', to: '/dashboard/alerts', icon: AlertTriangle },
      { label: 'API keys', to: '/dashboard/api-keys', icon: KeyRound },
      { label: 'SDK setup', to: '/dashboard/sdk', icon: BookOpen },
      // { label: 'Integrations', to: '/dashboard/integrations', icon: Plug },
    ],
  },
  // {
  //   label: 'Workspace',
  //   items: [
  //     { label: 'Team', to: '/dashboard/team', icon: Users },
  //     { label: 'Usage & billing', to: '/dashboard/usage', icon: Zap },
  //     { label: 'Audit log', to: '/dashboard/audit', icon: Shield },
  //     { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  //   ],
  // },
]

/** Breadcrumb labels by path segment. */
export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  logs: 'Logs',
  live: 'Live tail',
  errors: 'Errors',
  performance: 'Performance',
  tracing: 'Tracing',
  metrics: 'Metrics',
  alerts: 'Alerts',
  'api-keys': 'API keys',
  sdk: 'SDK setup',
  integrations: 'Integrations',
  team: 'Team',
  usage: 'Usage & billing',
  audit: 'Audit log',
  settings: 'Settings',
  security: 'Security',
  notifications: 'Notifications',
}

export const workspaces = [
  { id: 'ws_arcline', name: 'Arcline', plan: 'Pro' },
  { id: 'ws_personal', name: 'Personal', plan: 'Free' },
] as const

export const currentUser = {
  name: 'Maya Lindqvist',
  email: 'maya@arcline.dev',
  initials: 'ML',
} as const
