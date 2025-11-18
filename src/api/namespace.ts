import apiClient from './client'
import type {
  NamespaceItem,
  PaginatedResponse,
  PaginationParams,
  GlobalStatus,
} from './types'

export interface ListNamespaceParams extends PaginationParams {
  status?: GlobalStatus
}

export interface CreateNamespaceRequest {
  name: string
  metadata?: Record<string, string>
}

export interface UpdateNamespaceRequest {
  uid: string
  name: string
  metadata?: Record<string, string>
}

export interface UpdateNamespaceStatusRequest {
  uid: string
  status: GlobalStatus
}

export const namespaceService = {
  list: (params: ListNamespaceParams) =>
    apiClient.get<PaginatedResponse<NamespaceItem>>('/v1/namespaces', {
      params,
    }),
  get: (uid: string) =>
    apiClient.get<NamespaceItem>(`/v1/namespace/${uid}`),
  create: (data: CreateNamespaceRequest) =>
    apiClient.post('/v1/namespace', data),
  update: (uid: string, data: Omit<UpdateNamespaceRequest, 'uid'>) =>
    apiClient.put(`/v1/namespace/${uid}`, { uid, ...data }),
  updateStatus: (uid: string, status: GlobalStatus) =>
    apiClient.put(`/v1/namespace/${uid}/status`, { uid, status }),
  delete: (uid: string) => apiClient.delete(`/v1/namespace/${uid}`),
}

