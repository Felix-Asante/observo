import { MoreHorizontal, RefreshCw, ShieldOff } from 'lucide-react'
import { Dropdown, DropdownItem } from '@observo/ui'

import type { ApiKey } from '#/types/api-keys'

type KeyActionsProps = {
  apiKey: ApiKey
  onRegenerate: (apiKey: ApiKey) => void
  onRevoke: (apiKey: ApiKey) => void
}

export function KeyActions({
  apiKey,
  onRegenerate,
  onRevoke,
}: KeyActionsProps) {
  return (
    <Dropdown
      buttonAriaLabel={`Actions for key ${apiKey.prefix}`}
      buttonClassName="flex size-7 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-white/[0.05] hover:text-ink-100"
      button={<MoreHorizontal className="size-4" aria-hidden />}
    >
      <DropdownItem onClick={() => onRegenerate(apiKey)}>
        <RefreshCw className="size-3.5" aria-hidden />
        Regenerate
      </DropdownItem>
      <DropdownItem danger onClick={() => onRevoke(apiKey)}>
        <ShieldOff className="size-3.5" aria-hidden />
        Revoke
      </DropdownItem>
    </Dropdown>
  )
}
