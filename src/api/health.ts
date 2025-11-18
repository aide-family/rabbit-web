import apiClient from './client'
import type { HealthCheckReply } from './types'

export const healthService = {
  check: () => apiClient.get<HealthCheckReply>('/health'),
}

