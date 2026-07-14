import { Outlet, createFileRoute } from '@tanstack/react-router'

import { DashboardPagePending } from '#/components/dashboard/shared/dashboard-page-pending'
import { DashboardLayout } from '#/components/dashboard/shell/dashboard-layout'
import type { AuthSession } from '#/lib/auth-guards'
import { requireAuth } from '#/lib/auth-guards'

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ location }) => {
    const session = await requireAuth(location)
    return { session }
  },
  pendingMs: 0,
  pendingMinMs: 0,
  // pendingComponent: AppGroupPending,
  component: AppGroupLayout,
})

export type AppRouteContext = {
  session: AuthSession
}

function AppGroupLayout() {
  return <Outlet />
}

function AppGroupPending() {
  return (
    <DashboardLayout>
      <DashboardPagePending />
    </DashboardLayout>
  )
}
