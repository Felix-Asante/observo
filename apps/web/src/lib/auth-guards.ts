import { redirect } from '@tanstack/react-router'

import { authClient } from '#/lib/auth-client'
import { createIsomorphicFn } from '@tanstack/react-start'
import { httpClientWithCredentials } from './http'

interface MeResponse {
  session: {
    expiresAt: string
    token: string
    createdAt: string
    updatedAt: string
    ipAddress: string
    userAgent: string
    userId: string
    id: string
  }
  user: {
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: string
    updatedAt: string
    id: string
  }
}

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof getAuthSession>>
>

export const getAuthSession = createIsomorphicFn()
  .server(async () => {
    try {
      const session =
        await httpClientWithCredentials.get<MeResponse>('/users/me')
      return session.data
    } catch {
      return null
    }
  })
  .client(async () => {
    const { data, error } = await authClient.getSession()

    if (error || !data?.session) {
      return null
    }
    return data
  })

export function getSafeRedirect(path?: string) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }

  return '/dashboard'
}

export async function requireAuth(location: { pathname: string }) {
  const session = await getAuthSession()

  if (!session) {
    throw redirect({
      to: '/sign-in',
      search: { redirect: location.pathname },
    })
  }

  return session
}

export async function requireGuest() {
  const session = await getAuthSession()

  if (session) {
    throw redirect({ to: '/dashboard' })
  }
}
