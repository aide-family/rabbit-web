import apiClient from './client'
import type {
  MessageLogItem,
  PaginatedResponse,
  MessageType,
  MessageStatus,
} from './types'

export interface ListMessageLogParams {
  page?: number
  pageSize?: number
  status?: MessageStatus
  type?: MessageType
  startAtUnix?: string
  endAtUnix?: string
}

export interface CancelMessageLogRequest {
  uid: string
}

export interface RetryMessageLogRequest {
  uid: string
}

export const messageLogService = {
  list: (params: ListMessageLogParams) =>
    apiClient.get<PaginatedResponse<MessageLogItem>>('/v1/message-logs', {
      params,
    }),
  get: (uid: string) =>
    apiClient.get<MessageLogItem>(`/v1/message-log/${uid}`),
  retry: (uid: string) =>
    apiClient.put(`/v1/message-log/${uid}/retry`, { uid }),
  cancel: (uid: string) =>
    apiClient.put(`/v1/message-log/${uid}/cancel`, { uid }),
}

