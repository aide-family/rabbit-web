export enum WebhookAPP {
  WebhookAPP_UNKNOWN = 'WebhookAPP_UNKNOWN',
  OTHER = 'OTHER',
  DINGTALK = 'DINGTALK',
  WECHAT = 'WECHAT',
  FEISHU = 'FEISHU',
}

export enum HTTPMethod {
  HTTPMethod_UNKNOWN = 'HTTPMethod_UNKNOWN',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum GlobalStatus {
  GlobalStatus_UNKNOWN = 'GlobalStatus_UNKNOWN',
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum MessageStatus {
  MessageStatus_UNKNOWN = 'MessageStatus_UNKNOWN',
  Pending = 'Pending',
  Sending = 'Sending',
  Sent = 'Sent',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

export enum MessageType {
  MessageType_UNKNOWN = 'MessageType_UNKNOWN',
  Email = 'Email',
  Webhook = 'Webhook',
  SMS = 'SMS',
}

export enum TemplateAPP {
  TemplateAPP_UNKNOWN = 'TemplateAPP_UNKNOWN',
  TEMPLATE_APP_EMAIL = 'TEMPLATE_APP_EMAIL',
  TEMPLATE_APP_SMS = 'TEMPLATE_APP_SMS',
  TEMPLATE_APP_WEBHOOK_OTHER = 'TEMPLATE_APP_WEBHOOK_OTHER',
  TEMPLATE_APP_WEBHOOK_DINGTALK = 'TEMPLATE_APP_WEBHOOK_DINGTALK',
  TEMPLATE_APP_WEBHOOK_WECHAT = 'TEMPLATE_APP_WEBHOOK_WECHAT',
  TEMPLATE_APP_WEBHOOK_FEISHU = 'TEMPLATE_APP_WEBHOOK_FEISHU',
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface NamespaceItem {
  uid: string
  name: string
  metadata?: Record<string, string>
  createdAt: string
  updatedAt: string
  status: GlobalStatus
}

export interface EmailConfigItem {
  uid: string
  name: string
  host: string
  port: number
  username: string
  password?: string
  createdAt: string
  updatedAt: string
  status: GlobalStatus
}

export interface WebhookItem {
  uid: string
  app: WebhookAPP
  name: string
  url: string
  method: HTTPMethod
  headers?: Record<string, string>
  secret?: string
  createdAt: string
  updatedAt: string
  status: GlobalStatus
}

export interface TemplateItem {
  uid: string
  name: string
  app: TemplateAPP
  jsonData: string
  createdAt: string
  updatedAt: string
  status: GlobalStatus
}

export interface MessageLogItem {
  uid: string
  type: MessageType
  status: MessageStatus
  sendAt: string
  message: string
  config: string
  retryTotal: number
  lastError?: string
  createdAt: string
  updatedAt: string
}

export interface HealthCheckReply {
  status: string
  message: string
  timestamp: string
}

export interface SendReply {
  code: number
  message: string
}
