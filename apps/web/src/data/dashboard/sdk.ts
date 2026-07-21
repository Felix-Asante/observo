export type SdkTab = {
  id: string
  label: string
  comingSoon?: boolean
  /** npm package README or other full docs */
  docsUrl?: string
  install?: string
  init?: string
  example?: string
}

export const NODE_SDK_DOCS_URL =
  'https://www.npmjs.com/package/@getobservo/node'

export const sdkTabs: Array<SdkTab> = [
  {
    id: 'node',
    label: 'Node.js',
    docsUrl: NODE_SDK_DOCS_URL,
    install: 'npm install @getobservo/node',
    init: `import { createLogger } from '@getobservo/node'

export const log = createLogger({
  apiKey: process.env.OBSERVO_API_KEY!,
  host: process.env.OBSERVO_HOST!,
  appName: 'api',
  environment: process.env.NODE_ENV ?? 'production',
})`,
    example: `log.info('checkout.completed', {
  operation: 'checkout.create',
})

log.error('payment.failed', {
  operation: 'payment.charge',
  importance: 'high',
})`,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    comingSoon: true,
  },
  {
    id: 'go',
    label: 'Go',
    comingSoon: true,
  },
]
