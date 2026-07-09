import { Card, cn } from '@observo/ui'

import { Sparkline } from '#/components/dashboard/charts/sparkline'

type MetricCardProps = {
  label: string
  value: string
  delta: string
  deltaTone: 'positive' | 'negative' | 'neutral'
  spark: ReadonlyArray<number>
}

const toneClasses = {
  positive: 'text-success',
  negative: 'text-warning',
  neutral: 'text-ink-500',
} as const

export function MetricCard({
  label,
  value,
  delta,
  deltaTone,
  spark,
}: MetricCardProps) {
  return (
    <Card className="flex items-end justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="text-2xs font-medium tracking-wide text-ink-500 uppercase">
          {label}
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink-50">
          {value}
        </p>
        <p className={cn('mt-1 font-mono text-2xs', toneClasses[deltaTone])}>
          {delta}
        </p>
      </div>
      <Sparkline data={spark} className="hidden shrink-0 xl:block" />
    </Card>
  )
}
