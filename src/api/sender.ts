import apiClient from './client'
import type { SendReply } from './types'

export interface SendEmailRequest {
  uid: string
  subject: string
  body: string
  to: string[]
  cc?: string[]
  contentType?: string
  headers?: Record<string, string>
}

export interface SendEmailWithTemplateRequest {
  uid: string
  templateUID: string
  jsonData: string
  to: string[]
  cc?: string[]
}

export interface SendWebhookRequest {
  uid: string
  data: string
}

export interface SendWebhookWithTemplateRequest {
  uid: string
  templateUID: string
  jsonData: string
}

export interface SendMessageRequest {
  uid: string
}

export const senderService = {
  sendEmail: (uid: string, data: Omit<SendEmailRequest, 'uid'>) =>
    apiClient.post<SendReply>(`/v1/sender/email/${uid}`, { uid, ...data }),
  sendEmailWithTemplate: (
    uid: string,
    data: Omit<SendEmailWithTemplateRequest, 'uid'>
  ) =>
    apiClient.post<SendReply>(`/v1/sender/email/${uid}/template`, {
      uid,
      ...data,
    }),
  sendWebhook: (uid: string, data: Omit<SendWebhookRequest, 'uid'>) =>
    apiClient.post<SendReply>(`/v1/sender/webhook/${uid}`, { uid, ...data }),
  sendWebhookWithTemplate: (
    uid: string,
    data: Omit<SendWebhookWithTemplateRequest, 'uid'>
  ) =>
    apiClient.post<SendReply>(`/v1/sender/webhook/${uid}/template`, {
      uid,
      ...data,
    }),
  sendMessage: (data: SendMessageRequest) =>
    apiClient.post<SendReply>('/v1/sender/message', data),
}
