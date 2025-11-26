export interface SendTemplateItem extends Record<string, unknown> {
  id: number | string
  name: string
  sendType: number
  status: number
  content: string
  remark?: string
  createdAt?: string
  updatedAt?: string
  creator?: {
    nickname?: string
    name?: string
    avatar?: string
  }
}
