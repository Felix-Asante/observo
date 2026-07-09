import { Outlet, createFileRoute } from '@tanstack/react-router'

import { DashboardLayout } from '#/components/dashboard/shell/dashboard-layout'

export const Route = createFileRoute('/(app)/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard · Observo' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: DashboardShell,
})

function DashboardShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
