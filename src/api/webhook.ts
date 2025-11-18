import apiClient from './client'
import type {
  WebhookItem,
  PaginatedResponse,
  PaginationParams,
  GlobalStatus,
  WebhookAPP,
  HTTPMethod,
} from './types'

export interface ListWebhookParams extends PaginationParams {
  app?: WebhookAPP
  status?: GlobalStatus
}

export interface CreateWebhookRequest {
  app: WebhookAPP
  name: string
  url: string
  method: HTTPMethod
  headers?: Record<string, string>
  secret?: string
}

export interface UpdateWebhookRequest {
  uid: string
  app: WebhookAPP
  name: string
  url: string
  method: HTTPMethod
  headers?: Record<string, string>
  secret?: string
}

export interface UpdateWebhookStatusRequest {
  uid: string
  status: GlobalStatus
}

export const webhookService = {
  list: (params: ListWebhookParams) =>
    apiClient.get<PaginatedResponse<WebhookItem>>('/v1/webhook/configs', {
      params,
    }),
  get: (uid: string) => apiClient.get<WebhookItem>(`/v1/webhook/config/${uid}`),
  create: (data: CreateWebhookRequest) =>
    apiClient.post('/v1/webhook/config', data),
  update: (uid: string, data: Omit<UpdateWebhookRequest, 'uid'>) =>
    apiClient.put(`/v1/webhook/config/${uid}`, { uid, ...data }),
  updateStatus: (uid: string, status: GlobalStatus) =>
    apiClient.put(`/v1/webhook/config/${uid}/status`, { uid, status }),
  delete: (uid: string) => apiClient.delete(`/v1/webhook/config/${uid}`),
}
