import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  cn,
} from '@observo/ui'

import { workspaces } from '#/data/dashboard/navigation'

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const active = workspaces[0]

  return (
    <Dropdown
      align="start"
      buttonAriaLabel="Switch workspace"
      buttonClassName={cn(
        'flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-colors duration-200 hover:border-border hover:bg-white/[0.03]',
        collapsed && 'justify-center px-0',
      )}
      button={
        <>
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-iris-500/15 font-mono text-xs font-semibold text-iris-300"
          >
            {active.name[0]}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink-50">
                  {active.name}
                </span>
                <span className="block text-2xs text-ink-500">
                  {active.plan} plan
                </span>
              </span>
              <ChevronsUpDown
                className="size-3.5 shrink-0 text-ink-500"
                aria-hidden
              />
            </>
          )}
        </>
      }
      menuClassName="w-56"
    >
      <DropdownLabel>Workspaces</DropdownLabel>
      {workspaces.map((workspace) => (
        <DropdownItem key={workspace.id}>
          <span
            aria-hidden
            className="flex size-5 items-center justify-center rounded bg-iris-500/15 font-mono text-2xs font-semibold text-iris-300"
          >
            {workspace.name[0]}
          </span>
          <span className="flex-1">{workspace.name}</span>
          {workspace.id === active.id ? (
            <Check className="size-3.5 text-iris-400" aria-hidden />
          ) : null}
        </DropdownItem>
      ))}
      <DropdownSeparator />
      <DropdownItem>
        <Plus className="size-3.5" aria-hidden />
        Create workspace
      </DropdownItem>
    </Dropdown>
  )
}
