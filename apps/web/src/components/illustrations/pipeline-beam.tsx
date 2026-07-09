import { cn } from '@observo/ui'

type PipelineBeamProps = {
  className?: string
  /** Stagger the traveling pulse between connectors. */
  delay?: number
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Connector between pipeline stages: a faint rail with a traveling
 * iris pulse (stroke-dashoffset animation defined in the theme).
 */
export function PipelineBeam({
  className,
  delay = 0,
  orientation = 'horizontal',
}: PipelineBeamProps) {
  const horizontal = orientation === 'horizontal'

  return (
    <svg
      viewBox={horizontal ? '0 0 120 2' : '0 0 2 64'}
      preserveAspectRatio="none"
      aria-hidden
      className={cn(horizontal ? 'h-0.5 w-full' : 'h-16 w-0.5', className)}
    >
      <line
        x1={horizontal ? 0 : 1}
        y1={horizontal ? 1 : 0}
        x2={horizontal ? 120 : 1}
        y2={horizontal ? 1 : 64}
        stroke="var(--color-border-strong)"
        strokeWidth="2"
      />
      <line
        x1={horizontal ? 0 : 1}
        y1={horizontal ? 1 : 0}
        x2={horizontal ? 120 : 1}
        y2={horizontal ? 1 : 64}
        stroke="var(--color-iris-400)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="28 92"
        className="animate-beam motion-reduce:animate-none"
        style={{ animationDelay: `${delay}s` }}
      />
    </svg>
  )
}
