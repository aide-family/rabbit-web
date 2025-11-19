import apiClient from './client'
import type {
  TemplateItem,
  PaginatedResponse,
  PaginationParams,
  GlobalStatus,
  TemplateAPP,
} from './types'

export interface ListTemplateParams extends PaginationParams {
  status?: GlobalStatus
  app?: TemplateAPP
}

export interface CreateTemplateRequest {
  name: string
  app: TemplateAPP
  jsonData: string
}

export interface UpdateTemplateRequest {
  uid: string
  name: string
  app: TemplateAPP
  jsonData: string
}

export interface UpdateTemplateStatusRequest {
  uid: string
  status: GlobalStatus
}

export const templateService = {
  list: (params: ListTemplateParams) =>
    apiClient.get<PaginatedResponse<TemplateItem>>('/v1/templates', {
      params,
    }),
  get: (uid: string) => apiClient.get<TemplateItem>(`/v1/template/${uid}`),
  create: (data: CreateTemplateRequest) => apiClient.post('/v1/template', data),
  update: (uid: string, data: Omit<UpdateTemplateRequest, 'uid'>) =>
    apiClient.put(`/v1/template/${uid}`, { uid, ...data }),
  updateStatus: (uid: string, status: GlobalStatus) =>
    apiClient.put(`/v1/template/${uid}/status`, { uid, status }),
  delete: (uid: string) => apiClient.delete(`/v1/template/${uid}`),
}
