import { motion, useReducedMotion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { cn } from '@observo/ui'

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  {
    label: 'Upper & lowercase letters',
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { label: 'At least one number', test: (p: string) => /\d/.test(p) },
  { label: 'At least one symbol', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const

type Level = {
  label: string
  textClass: string
  barClass: string
}

function levelFor(score: number): Level {
  if (score <= 1)
    return { label: 'Weak', textClass: 'text-error', barClass: 'bg-error' }
  if (score <= 3)
    return { label: 'Good', textClass: 'text-warning', barClass: 'bg-warning' }
  return { label: 'Strong', textClass: 'text-success', barClass: 'bg-success' }
}

export function PasswordStrength({ password }: { password: string }) {
  const reducedMotion = useReducedMotion()
  const results = requirements.map((req) => req.test(password))
  const score = results.filter(Boolean).length
  const level = levelFor(score)
  const active = password.length > 0

  return (
    <div aria-live="polite">
      {/* Meter */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-1 gap-1.5" role="presentation">
          {requirements.map((_, index) => (
            <div
              key={`${index}-${password}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800"
            >
              <motion.div
                initial={false}
                animate={{ scaleX: active && index < score ? 1 : 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                        delay: index * 0.05,
                      }
                }
                style={{ originX: 0 }}
                className={cn('h-full rounded-full', level.barClass)}
              />
            </div>
          ))}
        </div>
        <span
          className={cn(
            'w-12 text-right font-mono text-2xs font-medium tracking-wide uppercase transition-colors duration-300',
            active ? level.textClass : 'text-ink-600',
          )}
        >
          {active ? level.label : '—'}
        </span>
      </div>

      {/* Requirements */}
      <ul className="mt-3.5 grid gap-2 sm:grid-cols-2">
        {requirements.map((req, index) => {
          const met = active && results[index]
          return (
            <li
              key={req.label}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors duration-300',
                met ? 'text-ink-200' : 'text-ink-500',
              )}
            >
              {met ? (
                <Check className="size-3.5 shrink-0 text-success" aria-hidden />
              ) : (
                <X className="size-3.5 shrink-0 text-ink-600" aria-hidden />
              )}
              {req.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
