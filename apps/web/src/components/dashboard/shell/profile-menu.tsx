import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@observo/ui'
import { useTransition } from 'react'

import { useAppSession } from '#/hooks/use-app-session'
import { signOut } from '#/lib/auth'
import { toast } from '#/lib/toast'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export function ProfileMenu() {
  const navigate = useNavigate()
  const session = useAppSession()
  const [_, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut()
        navigate({ to: '/sign-in' })
      } catch (error) {
        toast.fromError(error, 'Failed to sign out')
      }
    })
  }

  return (
    <Dropdown
      buttonAriaLabel="Open profile menu"
      buttonClassName="flex size-8 items-center justify-center rounded-full border border-iris-500/25 bg-iris-500/10 font-mono text-xs font-semibold text-iris-300 transition-colors duration-200 hover:border-iris-500/50"
      button={getInitials(session.user.name)}
      menuClassName="w-60"
    >
      <div className="px-2.5 py-2">
        <p className="text-sm font-medium text-ink-50">{session.user.name}</p>
        <p className="truncate text-xs text-ink-500">{session.user.email}</p>
      </div>
      <DropdownSeparator />
      <DropdownItem type="button" danger onClick={handleSignOut}>
        <LogOut className="size-3.5" aria-hidden />
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}
