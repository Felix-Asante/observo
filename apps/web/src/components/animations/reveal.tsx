import { motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps, Variants } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  y?: number
}

/** Single element that fades/slides in when scrolled into view. */
export function Reveal({ children, delay = 0, y = 16, ...props }: RevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
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
