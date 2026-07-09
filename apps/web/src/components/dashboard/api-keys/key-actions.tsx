import { useState } from 'react'
import { MoreHorizontal, RefreshCw, ShieldOff } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Dropdown,
  DropdownItem,
} from '@observo/ui'

import type { ApiKey } from '#/data/dashboard/types'

export function KeyActions({ apiKey }: { apiKey: ApiKey }) {
  const [confirm, setConfirm] = useState<'regenerate' | 'revoke' | null>(null)

  return (
    <>
      <Dropdown
        buttonAriaLabel={`Actions for key ${apiKey.prefix}`}
        buttonClassName="flex size-7 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-white/[0.05] hover:text-ink-100"
        button={<MoreHorizontal className="size-4" aria-hidden />}
      >
        <DropdownItem onClick={() => setConfirm('regenerate')}>
          <RefreshCw className="size-3.5" aria-hidden />
          Regenerate
        </DropdownItem>
        <DropdownItem danger onClick={() => setConfirm('revoke')}>
          <ShieldOff className="size-3.5" aria-hidden />
          Revoke
        </DropdownItem>
      </Dropdown>

      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        label={confirm === 'revoke' ? 'Revoke API key' : 'Regenerate API key'}
      >
        <DialogHeader
          title={
            confirm === 'revoke' ? 'Revoke this key?' : 'Regenerate this key?'
          }
          description={
            confirm === 'revoke'
              ? 'The key stops working immediately. Any SDK still using it will fail to authenticate.'
              : 'A new secret is issued and the current one stops working immediately. Update your deployments right after.'
          }
        />
        <div className="px-6 py-4">
          <code className="font-mono text-xs text-ink-400">
            {apiKey.prefix}
          </code>
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => setConfirm(null)}
            className={
              confirm === 'revoke'
                ? 'bg-error text-white shadow-none hover:bg-error/85'
                : undefined
            }
          >
            {confirm === 'revoke' ? 'Revoke key' : 'Regenerate'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
