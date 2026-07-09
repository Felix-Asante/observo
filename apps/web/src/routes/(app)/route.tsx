import { Outlet, createFileRoute } from '@tanstack/react-router'

/**
 * Pathless `(app)` group — authenticated application shell.
 * Auth enforcement will plug in here when Better Auth session
 * middleware is wired on the server.
 */
export const Route = createFileRoute('/(app)')({
  component: AppGroupLayout,
})

function AppGroupLayout() {
  return <Outlet />
}
