export const apiPath = import.meta.env.VITE_API_URL as string
export const serverApiUrl = import.meta.env.VITE_SERVER_API_URL as
  string | undefined

function stripApiVersion(url: string) {
  return url.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '')
}

function usesExternalApiHost() {
  return (
    Boolean(serverApiUrl?.startsWith('http')) && !apiPath.startsWith('http')
  )
}

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    if (usesExternalApiHost() && serverApiUrl) {
      return serverApiUrl.replace(/\/$/, '')
    }
    return apiPath
  }

  return serverApiUrl ?? 'http://localhost:8081/api/v1'
}

export function getAuthBaseUrl() {
  if (apiPath.startsWith('http')) {
    return stripApiVersion(apiPath)
  }

  if (serverApiUrl?.startsWith('http')) {
    return stripApiVersion(serverApiUrl)
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return stripApiVersion(serverApiUrl ?? 'http://localhost:8081/api/v1')
}

export function getObservoIngestHost() {
  return getApiBaseUrl().replace(/\/$/, '')
}
