import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Dialog, DialogFooter, DialogHeader } from '@observo/ui'

import { revokeApiKey } from '#/functions/api-keys'
import { queryKeys } from '#/lib/tanstack-query/query-keys'
import { toast } from '#/lib/toast'
import type { ApiKey } from '#/types/api-keys'

type RevokeKeyDialogProps = {
  apiKey: ApiKey
  open: boolean
  onClose: () => void
}

export function RevokeKeyDialog({
  apiKey,
  open,
  onClose,
}: RevokeKeyDialogProps) {
  const queryClient = useQueryClient()

  const revoke = useMutation({
    mutationFn: () => revokeApiKey({ data: { keyId: apiKey.id } }),
    onSuccess: () => {
      toast.success(
        'API key revoked',
        `${apiKey.prefix} can no longer authenticate.`,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all() })
      onClose()
    },
    onError: (error) => toast.fromError(error, 'Failed to revoke API key'),
  })

  const close = () => {
    if (revoke.isPending) return
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      dismissible={!revoke.isPending}
      label="Revoke API key"
    >
      <DialogHeader
        title="Revoke this key?"
        description="The key stops working immediately. Any SDK still using it will fail to authenticate. This cannot be undone — create a new key if you need access again."
      />
      <div className="px-6 py-4">
        <code className="font-mono text-xs text-ink-400">{apiKey.prefix}</code>
      </div>
      <DialogFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={close}
          disabled={revoke.isPending}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          loading={revoke.isPending}
          onClick={() => revoke.mutate()}
          className="bg-error text-white shadow-none hover:bg-error/85"
        >
          Revoke key
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
