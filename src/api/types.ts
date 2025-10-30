export enum Status {
  DISABLED = 0,
  ENABLED = 1,
}

export enum MessageType {
  EMAIL = 0,
  WEBHOOK = 1,
}

export enum MessageStatus {
  PENDING = 0,
  SENT = 1,
  FAILED = 2,
  CANCELLED = 3,
}

export enum AppType {
  EMAIL = 0,
  WEBHOOK = 1,
}

export enum HttpMethod {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3,
  PATCH = 4,
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: Status;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NamespaceItem {
  name: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface EmailConfigItem {
  uid: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface WebhookItem {
  uid: string;
  app: AppType;
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  secret?: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface TemplateItem {
  uid: string;
  name: string;
  app: AppType;
  jsonData: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
}

export interface MessageLogItem {
  uid: string;
  type: MessageType;
  status: MessageStatus;
  sendAt: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthCheckReply {
  status: string;
  message: string;
  timestamp: string;
}
