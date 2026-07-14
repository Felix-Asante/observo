import { useState } from 'react'
import { Check, Copy, ShieldAlert } from 'lucide-react'

type SecretKeyRevealProps = {
  secretKey: string
  warning?: string
}

export function SecretKeyReveal({
  secretKey,
  warning = 'Store this key in your secret manager. Anyone with it can write logs to your workspace. If it leaks, revoke it immediately — revocation propagates in seconds.',
}: SecretKeyRevealProps) {
  const [copied, setCopied] = useState(false)

  const copyKey = async () => {
    await navigator.clipboard.writeText(secretKey)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="space-y-4 px-6 py-5">
      <div className="surface-inset flex items-center gap-3 rounded-lg px-4 py-3">
        <code className="min-w-0 flex-1 break-all font-mono text-xs text-iris-200">
          {secretKey}
        </code>
        <button
          type="button"
          onClick={() => void copyKey()}
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
        <p className="text-xs leading-relaxed text-ink-300">{warning}</p>
      </div>
    </div>
  )
}
