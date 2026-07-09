import { Card } from '@observo/ui'
import type { ReactNode } from 'react'

export type ChartCardProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <div>
          <h2 className="text-sm font-medium text-ink-50">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 font-mono text-2xs text-ink-500">{subtitle}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  )
}
