import type { AlertRule } from './types'

export const alertRules: Array<AlertRule> = [
  {
    id: 'alr_1',
    name: 'High error rate',
    query: 'level:error env:production',
    condition: 'error rate > 1% for 5m',
    channels: ['slack', 'email'],
    severity: 'critical',
    enabled: true,
    lastTriggered: '12m ago',
  },
  {
    id: 'alr_2',
    name: 'Payment timeouts',
    query: 'app:payments message:"timeout"',
    condition: 'count > 20 in 10m',
    channels: ['slack', 'webhook'],
    severity: 'high',
    enabled: true,
    lastTriggered: '2h ago',
  },
  {
    id: 'alr_3',
    name: 'Queue depth warning',
    query: 'app:workers subsystem:queue level:warning',
    condition: 'count > 5 in 15m',
    channels: ['email'],
    severity: 'medium',
    enabled: true,
    lastTriggered: 'Jul 7',
  },
  {
    id: 'alr_4',
    name: 'Suspicious auth activity',
    query: 'security.suspicious:true',
    condition: 'count > 3 in 5m',
    channels: ['slack'],
    severity: 'high',
    enabled: false,
    lastTriggered: null,
  },
]
