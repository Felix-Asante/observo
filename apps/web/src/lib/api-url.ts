export const apiPath = import.meta.env.VITE_API_URL as string
export const serverApiUrl = import.meta.env.VITE_SERVER_API_URL as string

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return apiPath
  }

  return (
    (import.meta.env.VITE_SERVER_API_URL as string | undefined) ??
    'http://localhost:8081/api/v1'
  )
}

export function getAuthBaseUrl() {
  if (apiPath.startsWith('http')) {
    return apiPath.replace(/\/api\/v\d+\/?$/, '')
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return (
    (import.meta.env.VITE_WEB_URL as string | undefined) ??
    'http://localhost:3000'
  )
}
