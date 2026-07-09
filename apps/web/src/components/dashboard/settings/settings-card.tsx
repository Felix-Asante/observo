import { Card, cn } from '@observo/ui'
import type { ReactNode } from 'react'

export type SettingsCardProps = {
  title: string
  description?: string
  footer?: ReactNode
  danger?: boolean
  children: ReactNode
}

export function SettingsCard({
  title,
  description,
  footer,
  danger,
  children,
}: SettingsCardProps) {
  return (
    <Card className={cn(danger && 'border-error/30')}>
      <div className="px-6 py-5">
        <h2
          className={cn(
            'text-sm font-medium',
            danger ? 'text-error' : 'text-ink-50',
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-ink-400">
            {description}
          </p>
        ) : null}
        <div className="mt-5">{children}</div>
      </div>
      {footer ? (
        <div
          className={cn(
            'flex items-center justify-end gap-2.5 border-t px-6 py-3.5',
            danger ? 'border-error/20' : 'border-border-subtle',
          )}
        >
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
