import { createHttpClient } from '@observo/http-client'
import { createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { getApiBaseUrl } from '#/lib/api-url'

export const getServerCookieForwardHeaders = createServerOnlyFn(() => {
  const requestHeaders = getRequestHeaders()
  const cookieHeader = requestHeaders.get('cookie')

  if (!cookieHeader) {
    return undefined
  }

  return {
    Cookie: cookieHeader,
  }
})

export const httpClient = createHttpClient({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export async function createServerHttpClient() {
  const cookieHeaders = getServerCookieForwardHeaders()

  return createHttpClient({
    baseURL: getApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeaders ?? {}),
    },
    withCredentials: true,
  })
}

