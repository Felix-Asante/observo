export type ApiKey = {
  id: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  revokedAt: string | null
}
