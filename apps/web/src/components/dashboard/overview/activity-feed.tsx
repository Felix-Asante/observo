import {
  AlertTriangle,
  BarChart3,
  KeyRound,
  Rocket,
  UserRound,
} from 'lucide-react'
import { cn } from '@observo/ui'

import { recentActivity } from '#/data/dashboard/overview'
import type { ActivityItem } from '#/data/dashboard/types'

const kindConfig: Record<
  ActivityItem['kind'],
  { icon: typeof KeyRound; className: string }
> = {
  'api-key': { icon: KeyRound, className: 'text-iris-300 bg-iris-500/10' },
  alert: { icon: AlertTriangle, className: 'text-warning bg-warning/10' },
  deploy: { icon: Rocket, className: 'text-success bg-success/10' },
  quota: { icon: BarChart3, className: 'text-info bg-info/10' },
  member: { icon: UserRound, className: 'text-ink-300 bg-white/[0.05]' },
}

export function ActivityFeed() {
  return (
    <ol className="relative space-y-5">
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-3.5 w-px bg-border-subtle"
      />
      {recentActivity.map((item) => {
        const config = kindConfig[item.kind]
        return (
          <li key={item.id} className="relative flex items-start gap-3.5">
            <span
              aria-hidden
              className={cn(
                'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-ink-900',
                config.className,
              )}
            >
              <config.icon className="size-3.5" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm leading-snug text-ink-200">{item.text}</p>
              <p className="mt-0.5 font-mono text-2xs text-ink-500">
                {item.detail ? `${item.detail} · ` : ''}
                {item.time}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
