import { Outlet, createFileRoute } from '@tanstack/react-router'

import { DashboardPagePending } from '#/components/dashboard/shared/dashboard-page-pending'
import { DashboardLayout } from '#/components/dashboard/shell/dashboard-layout'

export const Route = createFileRoute('/(app)/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard · Observo' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  pendingMs: 0,
  pendingMinMs: 0,
  pendingComponent: DashboardPagePending,
  component: DashboardShell,
})

function DashboardShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
