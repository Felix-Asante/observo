import { motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps, Variants } from 'motion/react'
import type { ReactNode } from 'react'

/** Soft ease-out — less snap than a hard expo curve. */
const EASE = [0.22, 1, 0.36, 1] as const

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
}

/** LCP-safe variants — opacity stays 1 so text paints immediately. */
export const revealRiseItem: Variants = {
  hidden: { opacity: 1, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 22,
      mass: 0.9,
    },
  },
}

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  y?: number
  /**
   * `fade` — opacity 0→1 (default, fine below the fold).
   * `rise` — transform only; keeps opacity at 1 for LCP-critical content.
   */
  mode?: 'fade' | 'rise'
  /** Animate on mount instead of waiting for scroll into view (hero). */
  immediate?: boolean
}

/** Single element that fades/slides in when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y,
  mode = 'fade',
  immediate = false,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion()
  const rise = mode === 'rise'
  const offsetY = y ?? (rise ? 12 : 16)

  let initial: false | { opacity: number; y: number } = false
  if (!reducedMotion) {
    initial = rise
      ? { opacity: 1, y: offsetY }
      : { opacity: 0, y: offsetY }
  }

  const visible = { opacity: 1, y: 0 }
  const transition = rise
    ? {
        // Spring + soft settle reads smoother than a fixed duration tween.
        type: 'spring' as const,
        stiffness: 120,
        damping: 22,
        mass: 0.9,
        delay,
      }
    : { duration: 0.65, ease: EASE, delay }

  if (immediate) {
    return (
      <motion.div
        initial={initial}
        animate={visible}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  /** Delay between each child, in seconds. */
  stagger?: number
}

/** Parent that staggers its RevealGroupItem children. */
export function RevealGroup({
  children,
  stagger = 0.08,
  ...props
}: RevealGroupProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: stagger }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupItemProps = HTMLMotionProps<'div'> & {
  children: ReactNode
}

export function RevealGroupItem({ children, ...props }: RevealGroupItemProps) {
  return (
    <motion.div variants={revealItem} {...props}>
      {children}
    </motion.div>
  )
}
