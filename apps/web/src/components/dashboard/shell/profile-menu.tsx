import { useNavigate } from '@tanstack/react-router'
import { LogOut, Settings, User } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@observo/ui'

import { currentUser } from '#/data/dashboard/navigation'

export function ProfileMenu() {
  const navigate = useNavigate()

  return (
    <Dropdown
      buttonAriaLabel="Open profile menu"
      buttonClassName="flex size-8 items-center justify-center rounded-full border border-iris-500/25 bg-iris-500/10 font-mono text-xs font-semibold text-iris-300 transition-colors duration-200 hover:border-iris-500/50"
      button={currentUser.initials}
      menuClassName="w-60"
    >
      <div className="px-2.5 py-2">
        <p className="text-sm font-medium text-ink-50">{currentUser.name}</p>
        <p className="truncate text-xs text-ink-500">{currentUser.email}</p>
      </div>
      <DropdownSeparator />
      <DropdownItem onClick={() => navigate({ to: '/dashboard/settings' })}>
        <User className="size-3.5" aria-hidden />
        Profile
      </DropdownItem>
      <DropdownItem
        onClick={() => navigate({ to: '/dashboard/settings/security' })}
      >
        <Settings className="size-3.5" aria-hidden />
        Security
      </DropdownItem>
      <DropdownSeparator />
      {/* Better Auth default sign-out endpoint */}
      <form method="POST" action="/api/auth/sign-out">
        <DropdownItem type="submit" danger>
          <LogOut className="size-3.5" aria-hidden />
          Sign out
        </DropdownItem>
      </form>
    </Dropdown>
  )
}
