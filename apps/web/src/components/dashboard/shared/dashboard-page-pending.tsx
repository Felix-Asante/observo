import { Spinner } from '@observo/ui'

export function DashboardPagePending() {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Spinner className="size-6 text-iris-400" />
      <p className="text-sm text-ink-500">Loading…</p>
    </div>
  )
}
