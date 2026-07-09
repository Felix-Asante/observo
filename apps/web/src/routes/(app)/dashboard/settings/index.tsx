import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Dialog, DialogFooter, DialogHeader, Input } from '@observo/ui'

import { SettingsCard } from '#/components/dashboard/settings/settings-card'
import { currentUser } from '#/data/dashboard/navigation'

export const Route = createFileRoute('/(app)/dashboard/settings/')({
  head: () => ({ meta: [{ title: 'General settings · Observo' }] }),
  component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Profile"
        description="How you appear across the workspace."
        footer={
          <Button size="sm" type="submit" form="profile-form">
            Save changes
          </Button>
        }
      >
        {/* Better Auth default profile endpoint */}
        <form
          id="profile-form"
          method="POST"
          action="/api/auth/update-user"
          className="space-y-5"
        >
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-full border border-iris-500/25 bg-iris-500/10 font-mono text-lg font-semibold text-iris-300"
            >
              {currentUser.initials}
            </span>
            <div>
              <p className="text-sm font-medium text-ink-100">
                {currentUser.name}
              </p>
              <p className="font-mono text-xs text-ink-500">
                {currentUser.email}
              </p>
            </div>
          </div>
          <Input
            label="Full name"
            name="name"
            defaultValue={currentUser.name}
            autoComplete="name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={currentUser.email}
            autoComplete="email"
            disabled
          />
        </form>
      </SettingsCard>

      <SettingsCard
        danger
        title="Danger zone"
        description="Deleting your account removes all API keys and every log event you've ingested. This cannot be undone."
        footer={
          <Button
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="bg-error text-white shadow-none hover:bg-error/85"
          >
            Delete account
          </Button>
        }
      >
        <p className="font-mono text-xs text-ink-500">
          workspace: arcline · logs retained: 30 days · keys: 4 active
        </p>
      </SettingsCard>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        label="Delete account"
      >
        <DialogHeader
          title="Delete your account?"
          description="All log data, API keys, and sessions are permanently removed. Type your email to confirm."
        />
        <div className="px-6 py-5">
          <Input
            label="Confirm email"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={currentUser.email}
            className="font-mono"
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={confirmText !== currentUser.email}
            className="bg-error text-white shadow-none hover:bg-error/85"
          >
            Permanently delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
