import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

type AnimatedCounterProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/** Counts from 0 to `value` when scrolled into view. */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !isInView) return

    const format = (current: number) =>
      `${prefix}${current.toFixed(decimals)}${suffix}`

    if (reducedMotion) {
      node.textContent = format(value)
      return
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (current) => {
        node.textContent = format(current)
      },
    })

    return () => controls.stop()
  }, [isInView, value, decimals, prefix, suffix, duration, reducedMotion])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
