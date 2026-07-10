import { redirect } from '@tanstack/react-router'
import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { authClient } from '#/lib/auth-client'
import { httpClient } from './http'
import { API_ENDPOINTS } from '#/constants/api-endpoint'

export const getCookieHeader = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const cookie = headers.get('cookie')
    if (!cookie?.includes('better-auth.session_token')) {
      throw new Error('Unauthorized')
    }
    return cookie
  },
)

export const fetchAuthSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = await getCookieHeader()
    const response = await httpClient.get(API_ENDPOINTS.auth.me(), {
      headers: { cookie },
    })

    if (!response.data) {
      return null
    }

    return response.data
  },
)

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof fetchAuthSession>>
>

export const getAuthSession = createIsomorphicFn()
  .server(async () => fetchAuthSession())
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
