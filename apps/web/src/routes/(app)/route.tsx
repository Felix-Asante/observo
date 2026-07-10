import { Outlet, createFileRoute } from '@tanstack/react-router'

import type { AuthSession } from '#/lib/auth-guards'
import { requireAuth } from '#/lib/auth-guards'

export const Route = createFileRoute('/(app)')({
  beforeLoad: async ({ location }) => {
    const session = await requireAuth(location)
    return { session }
  },
  component: AppGroupLayout,
})

export type AppRouteContext = {
  session: AuthSession
}

function AppGroupLayout() {
  return <Outlet />
}
