import { createHttpClient } from '@observo/http-client'
import { createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

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
  baseURL: import.meta.env.VITE_API_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const httpClientWithCredentials = createHttpClient({
  baseURL: import.meta.env.VITE_API_URL!,
  headers: getServerCookieForwardHeaders(),
})
