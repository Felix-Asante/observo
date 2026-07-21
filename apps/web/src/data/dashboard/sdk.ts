export type SdkTab = {
  id: string
  label: string
  install: string
  init: string
  example: string
}

export const sdkTabs: Array<SdkTab> = [
  {
    id: 'node',
    label: 'Node.js',
    install: 'npm install @getobservo/node',
    init: `import { observo } from '@getobservo/node'

observo.init({
  apiKey: process.env.OBSERVO_API_KEY!,
  baseUrl: process.env.OBSERVO_BASE_URL!,
  appName: 'api',
  environment: 'production',
})`,
    example: `observo.info('checkout.completed', {
  operation: 'checkout.create',
})`,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    install: 'npm install @getobservo/next',
    init: `// instrumentation.ts — @getobservo/next coming soon
// For now use @getobservo/node:
import { observo } from '@getobservo/node'

observo.init({
  apiKey: process.env.OBSERVO_API_KEY!,
  baseUrl: process.env.OBSERVO_BASE_URL!,
  appName: 'web',
  environment: process.env.NODE_ENV,
})`,
    example: `observo.error('route.failed', {
  operation: 'checkout',
})`,
  },
  {
    id: 'python',
    label: 'Python',
    install: 'pip install observo  # planned',
    init: `import observo

observo.init(api_key=os.environ["OBSERVO_API_KEY"])`,
    example: `observo.info("job.finished", duration_ms=184)`,
  },
  {
    id: 'go',
    label: 'Go',
    install: 'go get github.com/getobservo/observo-go  # planned',
    init: `client := observo.New(os.Getenv("OBSERVO_API_KEY"))`,
    example: `client.Info(ctx, "deploy.rollout", observo.Fields{
  "region": "eu-west-1",
})`,
  },
]
