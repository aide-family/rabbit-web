import { AlarmSendType, Status } from '@/api/enum'
import {
  MailOutlined,
  MessageOutlined,
  WechatOutlined,
  DingtalkOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

export enum ActionKey {
  EDIT = 'edit',
  DELETE = 'delete',
  DETAIL = 'detail',
  ENABLE = 'enable',
  DISABLE = 'disable',
  OPERATION_LOG = 'operation_log',
}

export const StatusData: Record<Status, { text: string; color: string }> = {
  [Status.StatusAll]: { text: '全部', color: 'default' },
  [Status.StatusEnable]: { text: '启用', color: 'success' },
  [Status.StatusDisable]: { text: '禁用', color: 'error' },
}

export const AlarmSendTypeData: Record<
  AlarmSendType,
  { label: string; icon: ReactNode }
> = {
  [AlarmSendType.StrategyTypeUnknown]: {
    label: '未知',
    icon: <ApiOutlined />,
  },
  [AlarmSendType.AlarmSendTypeEmail]: {
    label: '邮件',
    icon: <MailOutlined />,
  },
  [AlarmSendType.AlarmSendTypeDingTalk]: {
    label: '钉钉',
    icon: <DingtalkOutlined />,
  },
  [AlarmSendType.AlarmSendTypeWeChat]: {
    label: '企业微信',
    icon: <WechatOutlined />,
  },
  [AlarmSendType.AlarmSendTypeFeiShu]: {
    label: '飞书',
    icon: <MessageOutlined />,
  },
  [AlarmSendType.AlarmSendTypeCustom]: {
    label: '自定义',
    icon: <ApiOutlined />,
  },
}
