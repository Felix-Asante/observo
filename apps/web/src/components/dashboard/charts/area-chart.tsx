import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type AreaChartProps = {
  data: ReadonlyArray<number>
  /** Labels for the first and last x-axis positions. */
  xLabels?: [string, string]
  height?: number
  className?: string
}

const WIDTH = 600

function buildPaths(
  data: ReadonlyArray<number>,
  width: number,
  height: number,
) {
  const max = Math.max(...data) * 1.1
  const step = width / (data.length - 1)
  const points = data.map((value, index) => ({
    x: index * step,
    y: height - (value / max) * (height - 8) - 2,
  }))

  const line = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`
      const prev = points[index - 1]
      const cx = (prev.x + point.x) / 2
      return `C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
    })
    .join(' ')

  const area = `${line} L ${width} ${height} L 0 ${height} Z`
  return { line, area }
}

export function AreaChart({
  data,
  xLabels,
  height = 180,
  className,
}: AreaChartProps) {
  const id = useId()
  const reducedMotion = useReducedMotion()
  const { line, area } = buildPaths(data, WIDTH, height)
  const gridLines = [0.25, 0.5, 0.75]

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Area chart"
        className="h-40 w-full lg:h-44"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--color-iris-500)" stopOpacity="0.25" />
            <stop
              offset="1"
              stopColor="var(--color-iris-500)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {gridLines.map((fraction) => (
          <line
            key={fraction}
            x1="0"
            x2={WIDTH}
            y1={height * fraction}
            y2={height * fraction}
            stroke="var(--color-border-subtle)"
            strokeDasharray="4 6"
          />
        ))}

        <motion.path
          d={area}
          fill={`url(#${id}-fill)`}
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-iris-400)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reducedMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {xLabels ? (
        <div className="mt-2 flex justify-between font-mono text-2xs text-ink-600">
          <span>{xLabels[0]}</span>
          <span>{xLabels[1]}</span>
        </div>
      ) : null}
    </div>
  )
}
