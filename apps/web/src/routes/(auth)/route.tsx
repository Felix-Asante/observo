import { Outlet, createFileRoute } from '@tanstack/react-router'

import { requireGuest } from '#/lib/auth-guards'

/** Pathless `(auth)` group — sign-in, sign-up, forgot-password. */
export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    await requireGuest()
  },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex' }],
  }),
  component: AuthGroupLayout,
})

function AuthGroupLayout() {
  return <Outlet />
}
