import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Dialog, DialogFooter, DialogHeader } from '@observo/ui'

import { SecretKeyReveal } from '#/components/dashboard/api-keys/secret-key-reveal'
import { regenerateApiKey } from '#/functions/api-keys'
import { queryKeys } from '#/lib/tanstack-query/query-keys'
import { toast } from '#/lib/toast'
import type { ApiKey } from '#/types/api-keys'

type RegenerateKeyDialogProps = {
  apiKey: ApiKey
  open: boolean
  onClose: () => void
}

type Step = 'confirm' | 'reveal'

export function RegenerateKeyDialog({
  apiKey,
  open,
  onClose,
}: RegenerateKeyDialogProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>('confirm')
  const [secretKey, setSecretKey] = useState<string | null>(null)

  const regenerate = useMutation({
    mutationFn: () => regenerateApiKey({ data: { keyId: apiKey.id } }),
    onSuccess: (data) => {
      if (!data.key) {
        toast.error(
          'Regenerated, but the new key was missing from the response',
        )
        queryClient.invalidateQueries({
          queryKey: queryKeys.apiKeys.all(),
        })
        onClose()
        return
      }
      setSecretKey(data.key)
      setStep('reveal')
    },
    onError: (error) => toast.fromError(error, 'Failed to regenerate API key'),
  })

  const locked = regenerate.isPending || step === 'reveal'

  const close = () => {
    if (locked) return
    onClose()
  }

  const finish = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all() })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      dismissible={!locked}
      label="Regenerate API key"
      className="max-w-lg"
    >
      {step === 'confirm' ? (
        <>
          <DialogHeader
            title="Regenerate this key?"
            description="A new secret is issued and the current one stops working immediately. Update your deployments right after you copy the new key."
          />
          <div className="px-6 py-4">
            <code className="font-mono text-xs text-ink-400">
              {apiKey.prefix}
            </code>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              disabled={regenerate.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              loading={regenerate.isPending}
              onClick={() => regenerate.mutate()}
            >
              Regenerate
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DialogHeader
            title="Your new API key"
            description="The previous secret is revoked. Copy the new key now — it's shown only once. This dialog stays open until you confirm."
          />
          {secretKey ? (
            <SecretKeyReveal
              secretKey={secretKey}
              warning="The old key no longer works. Replace it in every environment (SDK config, CI secrets, etc.) before closing this dialog. Anyone with the new key can write logs to your workspace."
            />
          ) : null}
          <DialogFooter>
            <Button size="sm" onClick={finish}>
              I've copied the key
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  )
}
