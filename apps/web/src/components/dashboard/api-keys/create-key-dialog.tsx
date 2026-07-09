import { useState } from 'react'
import { Check, Copy, ShieldAlert } from 'lucide-react'
import { Button, Dialog, DialogFooter, DialogHeader } from '@observo/ui'

import { exampleGeneratedKey } from '#/data/dashboard/api-keys'

type CreateKeyDialogProps = {
  open: boolean
  onClose: () => void
}

export function CreateKeyDialog({ open, onClose }: CreateKeyDialogProps) {
  const [step, setStep] = useState<'confirm' | 'reveal'>('confirm')
  const [copied, setCopied] = useState(false)

  const close = () => {
    onClose()
    setStep('confirm')
    setCopied(false)
  }

  const copyKey = () => {
    void navigator.clipboard.writeText(exampleGeneratedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      label="Create API key"
      className="max-w-lg"
    >
      {step === 'confirm' ? (
        <>
          <DialogHeader
            title="Create API key"
            description="Keys authenticate the SDK against the ingest API. You can hold up to 10 active keys."
          />
          <div className="px-6 py-5">
            <div className="surface-inset rounded-lg px-4 py-3.5 font-mono text-xs leading-6 text-ink-400">
              <p>
                <span className="text-ink-600"># format</span>
              </p>
              <p className="text-ink-200">
                OBV:<span className="text-iris-300">{'<key-id>'}</span>:
                <span className="text-iris-300">{'<secret>'}</span>
              </p>
              <p className="mt-2">
                <span className="text-ink-600"># usage</span>
              </p>
              <p className="text-ink-200">
                x-api-key: OBV:4fa2c81b…{' '}
                <span className="text-ink-600">→ POST /api/v1/logs/send</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setStep('reveal')}>
              Generate key
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DialogHeader
            title="Your new API key"
            description="Copy it now — for security, the full key is shown only once."
          />
          <div className="space-y-4 px-6 py-5">
            <div className="surface-inset flex items-center gap-3 rounded-lg px-4 py-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-iris-200">
                {exampleGeneratedKey}
              </code>
              <button
                type="button"
                onClick={copyKey}
                aria-label="Copy API key"
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-ink-300 transition-colors hover:border-border-strong hover:text-ink-50"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-success" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" aria-hidden />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border border-warning/25 bg-warning/[0.06] px-4 py-3">
              <ShieldAlert
                className="mt-0.5 size-4 shrink-0 text-warning"
                aria-hidden
              />
              <p className="text-xs leading-relaxed text-ink-300">
                Store this key in your secret manager. Anyone with it can write
                logs to your workspace. If it leaks, revoke it immediately —
                revocation propagates in seconds.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={close}>
              Done
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  )
}
