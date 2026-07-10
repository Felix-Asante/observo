import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Info, Plus, RefreshCw } from 'lucide-react'
import { Button, Skeleton, cn } from '@observo/ui'
import { useQuery } from '@tanstack/react-query'
import { getErrorMessage } from '@observo/utils'

import { ApiKeysTable } from '#/components/dashboard/api-keys/api-keys-table'
import { CreateKeyDialog } from '#/components/dashboard/api-keys/create-key-dialog'
import { PageHeader } from '#/components/dashboard/shared/page-header'
import { MAX_API_KEYS } from '#/data/dashboard/api-keys'
import { getApiKeys } from '#/functions/api-keys'

export const Route = createFileRoute('/(app)/dashboard/api-keys')({
  head: () => ({ meta: [{ title: 'API keys · Observo' }] }),
  component: ApiKeysPage,
})

function ApiKeysPage() {
  const [createOpen, setCreateOpen] = useState(false)

  const {
    data: apiKeys,
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: getApiKeys,
    placeholderData: (previous) => previous,
  })

  const keys = apiKeys ?? []
  const activeCount = keys.filter((key) => key.revokedAt === null).length
  const showSkeleton = isPending && !apiKeys
  const isRefreshing = isFetching && !isPending

  return (
    <>
      <PageHeader
        title="API keys"
        description="Authenticate the SDK against the ingest API. Keys are hashed at rest and shown in full only once."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              loading={isRefreshing}
              disabled={showSkeleton}
              aria-label="Refresh API keys"
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-3.5" aria-hidden />
              Create key
            </Button>
          </div>
        }
      />

      {isError ? (
        <div
          role="alert"
          className="mb-4 flex flex-col gap-3 rounded-lg border border-error/30 bg-error/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-error"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-ink-100">
                Couldn't load API keys
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            loading={isRefreshing}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-border bg-white/[0.02] px-4 py-3">
        <Info className="size-4 shrink-0 text-iris-400" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-400">
          {showSkeleton ? (
            <Skeleton className="inline-block h-3.5 w-48 align-middle" />
          ) : (
            <>
              <span className="font-mono text-ink-200">
                {activeCount} of {MAX_API_KEYS}
              </span>{' '}
              active keys in use. Send logs with the{' '}
              <code className="font-mono text-iris-300">x-api-key</code> header
              on{' '}
              <code className="font-mono text-ink-300">
                POST /api/v1/logs/send
              </code>
              .
            </>
          )}
        </p>
      </div>

      <div
        className={cn(
          'transition-opacity duration-200',
          isRefreshing && 'opacity-60',
        )}
      >
        <ApiKeysTable
          apiKeys={keys}
          loading={showSkeleton}
          onCreateKey={() => setCreateOpen(true)}
        />
      </div>

      <CreateKeyDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}
