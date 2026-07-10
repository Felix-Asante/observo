import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@observo/ui'

import { CommandPalette } from './command-palette'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import type { ReactNode } from 'react'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reducedMotion = useReducedMotion()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Close the mobile drawer on navigation
  useEffect(() => setMobileNavOpen(false), [pathname])

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
        }
        className="sticky top-0 z-50 hidden h-screen shrink-0 overflow-hidden lg:block"
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </motion.aside>

      {/* Mobile sidebar */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            aria-hidden
            onClick={() => setMobileNavOpen(false)}
            className="animate-fade-in absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
          />
          <div className="animate-slide-up absolute inset-y-0 left-0 w-64 bg-ink-900">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileNavOpen(false)}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <motion.main
          initial={false}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
          )}
        >
          {children}
        </motion.main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  )
}
