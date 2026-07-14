import { KeyRound, Plus } from 'lucide-react'
import {
  Badge,
  Button,
  EmptyState,
  TBody,
  THead,
  Table,
  Td,
  Th,
  Tr,
  cn,
} from '@observo/ui'

import { KeyActions } from '#/components/dashboard/api-keys/key-actions'
import { TableLoader } from '#/components/dashboard/shared/table-loader'
import type { TableLoaderColumn } from '#/components/dashboard/shared/table-loader'
import type { ApiKey } from '#/types/api-keys'

const API_KEY_COLUMNS: Array<TableLoaderColumn> = [
  { header: 'Key', skeletonClassName: 'h-4 w-44' },
  {
    header: 'Status',
    headerClassName: 'w-24',
    skeletonClassName: 'h-5 w-14 rounded-full',
  },
  {
    header: 'Created',
    headerClassName: 'hidden w-36 sm:table-cell',
    cellClassName: 'hidden sm:table-cell',
    skeletonClassName: 'h-4 w-24',
  },
  {
    header: 'Last used',
    headerClassName: 'hidden w-36 lg:table-cell',
    cellClassName: 'hidden lg:table-cell',
    skeletonClassName: 'h-4 w-20',
  },
  {
    header: <span className="sr-only">Actions</span>,
    headerClassName: 'w-12',
    skeletonClassName: 'size-7 rounded-md',
  },
]

type ApiKeysTableProps = {
  apiKeys: Array<ApiKey>
  loading?: boolean
  onCreateKey?: () => void
  onRegenerateKey?: (apiKey: ApiKey) => void
  onRevokeKey?: (apiKey: ApiKey) => void
}

export function ApiKeysTable({
  apiKeys,
  loading = false,
  onCreateKey,
  onRegenerateKey,
  onRevokeKey,
}: ApiKeysTableProps) {
  if (loading) {
    return <TableLoader columns={API_KEY_COLUMNS} label="Loading API keys" />
  }

  if (apiKeys.length === 0) {
    return (
      <EmptyState
        icon={<KeyRound className="size-5" aria-hidden />}
        title="No API keys yet"
        description="Create a key to authenticate the SDK against the ingest API. Keys are hashed at rest and shown in full only once."
        action={
          onCreateKey ? (
            <Button size="sm" onClick={onCreateKey}>
              <Plus className="size-3.5" aria-hidden />
              Create your first key
            </Button>
          ) : null
        }
      />
    )
  }

  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <Table>
        <THead>
          <tr>
            {API_KEY_COLUMNS.map((column, index) => (
              <Th key={index} className={column.headerClassName}>
                {column.header}
              </Th>
            ))}
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
                  {revoked ? '—' : (apiKey.lastUsedAt ?? '—')}
                </Td>
                <Td>
                  {revoked || !onRegenerateKey || !onRevokeKey ? null : (
                    <KeyActions
                      apiKey={apiKey}
                      onRegenerate={onRegenerateKey}
                      onRevoke={onRevokeKey}
                    />
                  )}
                </Td>
              </Tr>
            )
          })}
        </TBody>
      </Table>
    </div>
  )
}
