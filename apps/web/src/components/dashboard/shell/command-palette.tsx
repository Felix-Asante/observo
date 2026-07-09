import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createPortal } from 'react-dom'
import { ArrowLeft, KeyRound, Radio, Search } from 'lucide-react'
import { Kbd, cn } from '@observo/ui'

import { navSections } from '#/data/dashboard/navigation'
import type { LucideIcon } from 'lucide-react'

type Command = {
  id: string
  label: string
  group: string
  icon: LucideIcon
  to: string
  hint?: string
}

const navigationCommands: Array<Command> = navSections.flatMap((section) =>
  section.items.map((item) => ({
    id: item.to,
    label: item.label,
    group: 'Navigate',
    icon: item.icon,
    to: item.to,
  })),
)

const actionCommands: Array<Command> = [
  {
    id: 'action-create-key',
    label: 'Create API key',
    group: 'Actions',
    icon: KeyRound,
    to: '/dashboard/api-keys',
  },
  {
    id: 'action-live',
    label: 'Open live tail',
    group: 'Actions',
    icon: Radio,
    to: '/dashboard/live',
  },
  {
    id: 'action-sdk',
    label: 'SDK setup guide',
    group: 'Actions',
    icon: KeyRound,
    to: '/dashboard/sdk',
  },
  {
    id: 'action-landing',
    label: 'Back to landing page',
    group: 'Actions',
    icon: ArrowLeft,
    to: '/',
  },
]

const allCommands = [...navigationCommands, ...actionCommands]

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allCommands
    return allCommands.filter((command) =>
      command.label.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  if (!open) return null

  const run = (command: Command) => {
    onClose()
    navigate({ to: command.to })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') onClose()
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    }
    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      run(results[activeIndex])
    }
  }

  let lastGroup = ''

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[14vh]">
      <div
        aria-hidden
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="surface-panel animate-scale-in relative w-full max-w-lg overflow-hidden rounded-xl"
      >
        <div className="flex items-center gap-3 border-b border-border-subtle px-4">
          <Search className="size-4 shrink-0 text-ink-500" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and actions…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-sm text-ink-50 outline-none placeholder:text-ink-500"
          />
          <Kbd>esc</Kbd>
        </div>

        <div
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-500">
              No results for “{query}”
            </p>
          ) : (
            results.map((command, index) => {
              const showGroup = command.group !== lastGroup
              lastGroup = command.group
              return (
                <div key={command.id}>
                  {showGroup ? (
                    <p className="label-mono px-3 pt-3 pb-1.5 text-ink-600 first:pt-1">
                      {command.group}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onClick={() => run(command)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-100',
                      index === activeIndex
                        ? 'bg-iris-500/10 text-iris-100'
                        : 'text-ink-200',
                    )}
                  >
                    <command.icon
                      className={cn(
                        'size-4 shrink-0',
                        index === activeIndex
                          ? 'text-iris-300'
                          : 'text-ink-500',
                      )}
                      aria-hidden
                    />
                    {command.label}
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border-subtle px-4 py-2.5 text-2xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            open
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
