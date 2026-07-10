export const API_ENDPOINTS = {
  auth: {
    me: () => `/auth/get-session`,
  },
  apiKeys: {
    root: () => `/api-keys`,
    regenerate: (keyId: string) => `/api-keys/${keyId}/regenerate`,
    delete: (keyId: string) => `/api-keys/${keyId}`,
  },
}
