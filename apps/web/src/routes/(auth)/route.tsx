import { Outlet, createFileRoute } from '@tanstack/react-router'

/** Pathless `(auth)` group — sign-in, sign-up, forgot-password. */
export const Route = createFileRoute('/(auth)')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex' }],
  }),
  component: AuthGroupLayout,
})

function AuthGroupLayout() {
  return <Outlet />
}
