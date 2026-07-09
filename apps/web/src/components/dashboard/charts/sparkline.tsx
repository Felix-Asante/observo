import { cn } from '@observo/ui'

type SparklineProps = {
  data: ReadonlyArray<number>
  className?: string
  strokeClass?: string
}

function toPoints(data: ReadonlyArray<number>, width: number, height: number) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  return data
    .map((value, index) => {
      const x = index * step
      const y = height - ((value - min) / range) * (height - 2) - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function Sparkline({ data, className, strokeClass }: SparklineProps) {
  return (
    <svg
      viewBox="0 0 96 28"
      preserveAspectRatio="none"
      aria-hidden
      className={cn('h-7 w-24', className)}
    >
      <polyline
        points={toPoints(data, 96, 28)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('text-chart-1', strokeClass)}
      />
    </svg>
  )
}
