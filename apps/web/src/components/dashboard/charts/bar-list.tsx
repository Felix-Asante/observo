import { motion, useReducedMotion } from 'motion/react'

type BarListProps = {
  items: ReadonlyArray<{ name: string; count: number }>
  className?: string
}

/** Horizontal bar comparison — labels left, values right. */
export function BarList({ items, className }: BarListProps) {
  const reducedMotion = useReducedMotion()
  const max = Math.max(...items.map((item) => item.count))

  return (
    <div className={className}>
      <ul className="space-y-3.5">
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-ink-300">
                {item.name}
              </span>
              <span className="font-mono text-xs text-ink-500">
                {item.count}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-800/80">
              <motion.div
                initial={
                  reducedMotion
                    ? { width: `${(item.count / max) * 100}%` }
                    : { width: 0 }
                }
                whileInView={{ width: `${(item.count / max) * 100}%` }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-error/70 to-error"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
