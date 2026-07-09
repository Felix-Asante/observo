export type AuditEntry = {
  id: string
  actor: string
  action: string
  resource: string
  detail?: string
  ip: string
  time: string
}

export const auditLog: Array<AuditEntry> = [
  {
    id: 'aud_001',
    actor: 'maya@arcline.dev',
    action: 'api_key.regenerate',
    resource: 'OBV:4fa2…',
    detail: 'key rotated, old key revoked',
    ip: '52.14.8.101',
    time: 'Jul 9, 13:04',
  },
  {
    id: 'aud_002',
    actor: 'dev@arcline.dev',
    action: 'alert.update',
    resource: 'High error rate',
    detail: 'threshold 1% → 0.8%',
    ip: '104.28.12.44',
    time: 'Jul 9, 11:22',
  },
  {
    id: 'aud_003',
    actor: 'maya@arcline.dev',
    action: 'member.invite',
    resource: 'priya@meridian.io',
    detail: 'role: member',
    ip: '52.14.8.101',
    time: 'Jul 7, 09:15',
  },
  {
    id: 'aud_004',
    actor: 'dev@arcline.dev',
    action: 'integration.connect',
    resource: 'Slack',
    detail: 'channel #incidents',
    ip: '104.28.12.44',
    time: 'Jul 5, 16:48',
  },
  {
    id: 'aud_005',
    actor: 'maya@arcline.dev',
    action: 'session.sign_in',
    resource: 'session',
    ip: '52.14.8.101',
    time: 'Jul 9, 08:01',
  },
  {
    id: 'aud_006',
    actor: 'system',
    action: 'quota.warning',
    resource: 'ingest',
    detail: '74% of monthly quota',
    ip: '—',
    time: 'Jul 8, 00:00',
  },
]
