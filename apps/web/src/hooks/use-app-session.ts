import { getRouteApi } from '@tanstack/react-router'

import type { AuthSession } from '#/lib/auth-guards'

const appRoute = getRouteApi('/(app)')

export function useAppSession(): AuthSession {
  const { session } = appRoute.useRouteContext()
  return session
}
