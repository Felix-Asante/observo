export const apiPath = import.meta.env.VITE_API_URL as string
export const serverApiUrl = import.meta.env.VITE_SERVER_API_URL as
  string | undefined

function stripApiVersion(url: string) {
  return url.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '')
}

/**
 * Browser calls must stay same-origin (`/api/v1`) so Better Auth session
 * cookies are set on the web host. The Workers `/api` proxy (and Vite
 * proxy in local dev) forward to the Railway API.
 *
 * Server functions call the Railway API directly via VITE_SERVER_API_URL
 * and forward the incoming Cookie header.
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return apiPath
  }

  return serverApiUrl ?? 'http://localhost:8081/api/v1'
}

export function getAuthBaseUrl() {
  if (typeof window !== 'undefined') {
    if (!apiPath.startsWith('http')) {
      return window.location.origin
    }
    return stripApiVersion(apiPath)
  }

  if (apiPath.startsWith('http')) {
    return stripApiVersion(apiPath)
  }

  if (serverApiUrl?.startsWith('http')) {
    return stripApiVersion(serverApiUrl)
  }

  return stripApiVersion(serverApiUrl ?? 'http://localhost:8081/api/v1')
}

export function getObservoIngestHost() {
  return (serverApiUrl ?? getApiBaseUrl()).replace(/\/$/, '')
}
