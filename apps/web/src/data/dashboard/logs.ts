export const timeRanges = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
] as const

export const savedSearches = [
  {
    label: 'Prod errors',
    filters: {
      search: '',
      level: 'error',
      app: 'all',
      environment: 'production',
      range: '24h',
    },
  },
  {
    label: 'Errors',
    filters: {
      search: '',
      level: 'error',
      app: 'all',
      environment: 'all',
      range: '24h',
    },
  },
  {
    label: 'Warnings',
    filters: {
      search: '',
      level: 'warning',
      app: 'all',
      environment: 'all',
      range: '24h',
    },
  },
] as const
