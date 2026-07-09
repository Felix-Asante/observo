import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Info, Plus } from 'lucide-react'
import { Badge, Button, TBody, THead, Table, Td, Th, Tr, cn } from '@observo/ui'

import { CreateKeyDialog } from '#/components/dashboard/api-keys/create-key-dialog'
import { KeyActions } from '#/components/dashboard/api-keys/key-actions'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { MAX_API_KEYS, apiKeys } from '#/data/dashboard/api-keys'

export const Route = createFileRoute('/(app)/dashboard/api-keys')({
  head: () => ({ meta: [{ title: 'API keys · Observo' }] }),
  component: ApiKeysPage,
})

function ApiKeysPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const activeCount = apiKeys.filter((key) => key.revokedAt === null).length

  return (
    <>
      <PageHeader
        title="API keys"
        description="Authenticate the SDK against the ingest API. Keys are hashed at rest and shown in full only once."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-3.5" aria-hidden />
            Create key
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
        <Info className="size-4 shrink-0 text-iris-400" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-400">
          <span className="font-mono text-ink-200">
            {activeCount} of {MAX_API_KEYS}
          </span>{' '}
          active keys in use. Send logs with the{' '}
          <code className="font-mono text-iris-300">x-api-key</code> header on{' '}
          <code className="font-mono text-ink-300">POST /api/v1/logs/send</code>
          .
        </p>
      </div>

      <div className="surface-card overflow-hidden rounded-xl">
        <Table>
          <THead>
            <tr>
              <Th>Key</Th>
              <Th className="w-24">Status</Th>
              <Th className="hidden w-36 sm:table-cell">Created</Th>
              <Th className="hidden w-36 lg:table-cell">Last used</Th>
              <Th className="w-12">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </THead>
          <TBody>
            {apiKeys.map((apiKey) => {
              const revoked = apiKey.revokedAt !== null
              return (
                <Tr key={apiKey.id} className={cn(revoked && 'opacity-50')}>
                  <Td className="font-mono text-xs text-ink-100">
                    {apiKey.prefix}
                  </Td>
                  <Td>
                    <Badge variant={revoked ? 'neutral' : 'success'} size="sm">
                      {revoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </Td>
                  <Td className="hidden font-mono text-xs whitespace-nowrap text-ink-400 sm:table-cell">
                    {apiKey.createdAt}
                  </Td>
                  <Td className="hidden font-mono text-xs whitespace-nowrap text-ink-400 lg:table-cell">
                    {revoked ? '—' : apiKey.lastUsedAt}
                  </Td>
                  <Td>{revoked ? null : <KeyActions apiKey={apiKey} />}</Td>
                </Tr>
              )
            })}
          </TBody>
        </Table>
      </div>

      <CreateKeyDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}
