import type { ReactNode } from 'react'

export type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 lg:mb-8">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-ink-50 lg:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  )
}
