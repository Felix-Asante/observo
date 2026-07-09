import { createFileRoute } from '@tanstack/react-router'
import { TBody, THead, Table, Td, Th, Tr } from '@observo/ui'

import { PageHeader } from '#/components/dashboard/shared/page-header'
import { auditLog } from '#/data/dashboard/audit'

export const Route = createFileRoute('/(app)/dashboard/audit')({
  head: () => ({ meta: [{ title: 'Audit log · Observo' }] }),
  component: AuditPage,
})

function AuditPage() {
  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every security-sensitive action in this workspace — who did what, when, and from where."
      />

      <div className="surface-card overflow-hidden rounded-xl">
        <Table>
          <THead>
            <tr>
              <Th className="w-36">Time</Th>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th className="hidden lg:table-cell">Resource</Th>
              <Th className="hidden w-28 sm:table-cell">IP</Th>
            </tr>
          </THead>
          <TBody>
            {auditLog.map((entry) => (
              <Tr key={entry.id}>
                <Td className="font-mono text-xs whitespace-nowrap text-ink-500">
                  {entry.time}
                </Td>
                <Td className="font-mono text-xs text-ink-200">
                  {entry.actor}
                </Td>
                <Td>
                  <p className="font-mono text-xs text-iris-300">
                    {entry.action}
                  </p>
                  {entry.detail ? (
                    <p className="mt-0.5 font-mono text-2xs text-ink-600">
                      {entry.detail}
                    </p>
                  ) : null}
                </Td>
                <Td className="hidden font-mono text-xs text-ink-400 lg:table-cell">
                  {entry.resource}
                </Td>
                <Td className="hidden font-mono text-xs text-ink-600 sm:table-cell">
                  {entry.ip}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  )
}
