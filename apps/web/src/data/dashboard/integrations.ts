import { Mail, MessageSquare, Webhook } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Integration = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  connected: boolean
  detail?: string
}

export const integrations: Array<Integration> = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send alert notifications to a channel when rules trigger.',
    icon: MessageSquare,
    connected: true,
    detail: '#incidents · arcline workspace',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'POST alert payloads to any HTTPS endpoint you control.',
    icon: Webhook,
    connected: true,
    detail: 'https://hooks.arcline.dev/observo',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Deliver critical alerts to team members via email.',
    icon: Mail,
    connected: false,
  },
]
