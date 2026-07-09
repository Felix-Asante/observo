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
    install: 'npm install @observo/sdk',
    init: `import { observo } from '@observo/sdk'

observo.init({ apiKey: process.env.OBSERVO_KEY })`,
    example: `observo.info('checkout.completed', {
  orderId: order.id,
  amount: 4200,
})`,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    install: 'npm install @observo/next',
    init: `// instrumentation.ts
import { register } from '@observo/next'

export const onRequestError = register({
  apiKey: process.env.OBSERVO_KEY,
  traces: true,
})`,
    example: `// Automatic request logging + error capture
// No additional code needed per route`,
  },
  {
    id: 'python',
    label: 'Python',
    install: 'pip install observo',
    init: `import observo

observo.init(api_key=os.environ["OBSERVO_KEY"])`,
    example: `observo.info("job.finished", duration_ms=184)`,
  },
  {
    id: 'go',
    label: 'Go',
    install: 'go get github.com/observo/observo-go',
    init: `client := observo.New(os.Getenv("OBSERVO_KEY"))`,
    example: `client.Info(ctx, "deploy.rollout", observo.Fields{
  "region": "eu-west-1",
})`,
  },
]
