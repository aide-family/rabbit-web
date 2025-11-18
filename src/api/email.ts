import apiClient from './client'
import type {
  EmailConfigItem,
  PaginatedResponse,
  PaginationParams,
  GlobalStatus,
} from './types'

export interface ListEmailConfigParams extends PaginationParams {
  status?: GlobalStatus
}

export interface CreateEmailConfigRequest {
  name: string
  host: string
  port: number
  username: string
  password: string
}

export interface UpdateEmailConfigRequest {
  uid: string
  name: string
  host: string
  port: number
  username: string
  password: string
}

export interface UpdateEmailConfigStatusRequest {
  uid: string
  status: GlobalStatus
}

export const emailService = {
  list: (params: ListEmailConfigParams) =>
    apiClient.get<PaginatedResponse<EmailConfigItem>>('/v1/email/configs', {
      params,
    }),
  get: (uid: string) =>
    apiClient.get<EmailConfigItem>(`/v1/email/config/${uid}`),
  create: (data: CreateEmailConfigRequest) =>
    apiClient.post('/v1/email/config', data),
  update: (uid: string, data: Omit<UpdateEmailConfigRequest, 'uid'>) =>
    apiClient.put(`/v1/email/config/${uid}`, { uid, ...data }),
  updateStatus: (uid: string, status: GlobalStatus) =>
    apiClient.put(`/v1/email/config/${uid}/status`, { uid, status }),
  delete: (uid: string) => apiClient.delete(`/v1/email/config/${uid}`),
}
