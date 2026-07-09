import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, Menu, Search } from 'lucide-react'
import { Kbd } from '@observo/ui'

import { breadcrumbLabels } from '#/data/dashboard/navigation'
import { Notifications } from './notifications'
import { ProfileMenu } from './profile-menu'

type TopbarProps = {
  onOpenPalette: () => void
  onOpenMobileNav: () => void
}

export function Topbar({ onOpenPalette, onOpenMobileNav }: TopbarProps) {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border-subtle bg-ink-950/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="cursor-pointer rounded-md p-1.5 text-ink-400 transition-colors hover:bg-white/[0.05] hover:text-ink-100 lg:hidden"
      >
        <Menu className="size-4.5" aria-hidden />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
        <ol className="flex items-center gap-1.5 text-sm">
          {segments.map((segment, index) => {
            const to = `/${segments.slice(0, index + 1).join('/')}`
            const last = index === segments.length - 1
            return (
              <li key={to} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-ink-600"
                    aria-hidden
                  />
                )}
                {last ? (
                  <span
                    aria-current="page"
                    className="truncate font-medium text-ink-100"
                  >
                    {breadcrumbLabels[segment] ?? segment}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="cursor-pointer text-ink-400 transition-colors duration-150 hover:text-ink-100"
                  >
                    {breadcrumbLabels[segment] ?? segment}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex-1" />

      {/* Search / palette trigger */}
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-8 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white/[0.02] px-3 text-sm text-ink-500 transition-colors duration-200 hover:border-border-strong hover:text-ink-300 sm:w-60"
      >
        <Search className="size-3.5 shrink-0" aria-hidden />
        <span className="hidden flex-1 text-left sm:block">Search…</span>
        <span className="hidden items-center gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <Notifications />
      <ProfileMenu />
    </header>
  )
}
