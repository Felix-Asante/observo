import { Link, useLocation } from '@tanstack/react-router'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Logo, StatusDot, cn } from '@observo/ui'

import { navSections } from '#/data/dashboard/navigation'
import { WorkspaceSwitcher } from './workspace-switcher'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}

export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full flex-col border-r border-border-subtle bg-ink-900/60">
      {/* Brand */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-border-subtle px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <Link to="/" aria-label="Observo home" className="cursor-pointer">
          <Logo withWordmark={!collapsed} />
        </Link>
      </div>

      {/* Workspace */}
      {/* <div className={cn('px-3 pt-3', collapsed && 'px-2')}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div> */}

      {/* Navigation */}
      <nav
        aria-label="Dashboard navigation"
        className={cn('flex-1 overflow-y-auto px-3 py-4', collapsed && 'px-2')}
      >
        {navSections.map((section) => (
          <div key={section.label} className="mb-6 last:mb-0">
            {!collapsed && (
              <p className="label-mono mb-2 px-2 text-ink-600">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150',
                        collapsed && 'justify-center px-0 py-2.5',
                        active
                          ? 'bg-iris-500/10 font-medium text-iris-200'
                          : 'text-ink-300 hover:bg-white/[0.04] hover:text-ink-50',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'size-4 shrink-0 transition-colors duration-150',
                          active
                            ? 'text-iris-400'
                            : 'text-ink-500 group-hover:text-ink-300',
                        )}
                        aria-hidden
                      />
                      {!collapsed && item.label}
                      {!collapsed && item.to === '/dashboard/live' && (
                        <StatusDot tone="success" pulse className="ml-auto" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'shrink-0 border-t border-border-subtle p-3',
          collapsed && 'p-2',
        )}
      >
        {!collapsed && (
          <p className="mb-2 flex items-center gap-2 px-2 text-xs text-ink-500">
            <StatusDot tone="success" pulse />
            All systems operational
          </p>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-400 transition-colors duration-150 hover:bg-white/[0.04] hover:text-ink-100',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden />
          ) : (
            <>
              <PanelLeftClose className="size-4" aria-hidden />
              Collapse
            </>
          )}
        </button>
      </div>
    </div>
  )
}
