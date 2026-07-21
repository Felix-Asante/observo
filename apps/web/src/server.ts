import handler from '@tanstack/react-start/server-entry'

/**
 * Upstream API origin (no /api/vN suffix). Baked at build time from
 * VITE_SERVER_API_URL so staging/prod Workers can reverse-proxy /api/*.
 */
const API_ORIGIN = (
  (import.meta.env.VITE_SERVER_API_URL as string | undefined) ??
  'http://localhost:8081/api/v1'
).replace(/\/api\/v\d+\/?$/, '')

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'cf-connecting-ip',
  'cf-ray',
  'cf-visitor',
])

async function proxyToApi(request: Request): Promise<Response> {
  const incoming = new URL(request.url)
  const target = new URL(
    `${incoming.pathname}${incoming.search}`,
    API_ORIGIN.endsWith('/') ? API_ORIGIN : `${API_ORIGIN}/`,
  )

  const headers = new Headers()
  for (const [key, value] of request.headers.entries()) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  }
  headers.set('x-forwarded-host', incoming.host)
  headers.set('x-forwarded-proto', incoming.protocol.replace(':', ''))

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
  }

  const upstream = await fetch(target, init)

  const responseHeaders = new Headers(upstream.headers)
  // Ensure the browser attributes cookies to the Workers host, not Railway.
  const setCookies = upstream.headers.getSetCookie()
  if (setCookies.length > 0) {
    responseHeaders.delete('set-cookie')
    for (const cookie of setCookies) {
      responseHeaders.append(
        'set-cookie',
        cookie.replace(/;\s*Domain=[^;]*/gi, ''),
      )
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export default {
  async fetch(request: Request) {
    const { pathname } = new URL(request.url)

    if (pathname.startsWith('/api/')) {
      return proxyToApi(request)
    }

    return handler.fetch(request)
  },
}
