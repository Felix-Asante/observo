import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Mail, Plus, UserPlus } from 'lucide-react'
import {
  Badge,
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
} from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'
import { pendingInvites, teamMembers } from '#/data/dashboard/team'

export const Route = createFileRoute('/(app)/dashboard/team')({
  head: () => ({ meta: [{ title: 'Team · Observo' }] }),
  component: TeamPage,
})

const roleVariant = {
  owner: 'iris',
  admin: 'neutral',
  member: 'outline',
} as const

function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Team"
        description="Everyone with access to this workspace. Members inherit the workspace API keys and log data."
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-3.5" aria-hidden />
            Invite member
          </Button>
        }
      />

      <div className="surface-card mb-6 overflow-hidden rounded-xl">
        <Table>
          <THead>
            <tr>
              <Th>Member</Th>
              <Th className="w-24">Role</Th>
              <Th className="hidden w-32 sm:table-cell">Last active</Th>
            </tr>
          </THead>
          <TBody>
            {teamMembers.map((member) => (
              <Tr key={member.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-iris-500/25 bg-iris-500/10 font-mono text-2xs font-semibold text-iris-300"
                    >
                      {member.initials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-100">
                        {member.name}
                      </p>
                      <p className="font-mono text-2xs text-ink-500">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge variant={roleVariant[member.role]} size="sm">
                    {member.role}
                  </Badge>
                </Td>
                <Td className="hidden font-mono text-xs text-ink-500 sm:table-cell">
                  {member.lastActive}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      {pendingInvites.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-medium text-ink-200">
            Pending invites
          </h2>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.email}
                className="flex items-center justify-between rounded-lg border border-border bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-ink-500" aria-hidden />
                  <span className="font-mono text-xs text-ink-200">
                    {invite.email}
                  </span>
                  <Badge variant="outline" size="sm">
                    {invite.role}
                  </Badge>
                </div>
                <span className="font-mono text-2xs text-ink-600">
                  sent {invite.sent}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        label="Invite team member"
      >
        <DialogHeader
          title="Invite a team member"
          description="They'll receive an email with a link to join this workspace."
        />
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setInviteOpen(false)
          }}
        >
          <div className="space-y-5 px-6 py-5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="colleague@company.com"
              required
            />
            <Select label="Role" name="role" defaultValue="member">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <Plus className="size-3.5" aria-hidden />
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
