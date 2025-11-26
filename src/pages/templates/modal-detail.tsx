import { AlarmSendType, Status } from '@/api/enum'
import { AlarmSendTypeData, StatusData } from '@/api/global'
import { templateService } from '@/api/template'
import type { SendTemplateItem } from '@/api/request/types/model-types'
import { GlobalContext } from '@/utils/context'
import { CopyOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import {
  Avatar,
  Badge,
  Descriptions,
  type DescriptionsProps,
  Modal,
  type ModalProps,
  Space,
  Tooltip,
  message,
} from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'
import atomOneLight from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light'

// 获取模板详情
const getTemplate = async (
  id: number | string
): Promise<{ detail: SendTemplateItem }> => {
  const res = await templateService.get(id.toString())
  const item = res.data
  // 将 TemplateItem 转换为 SendTemplateItem
  return {
    detail: {
      id: id,
      name: item.name,
      sendType: 0, // 需要根据 item.app 映射
      status: item.status === 'ENABLED' ? 1 : 2,
      content: item.jsonData,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
  }
}

export interface SendTemplateDetailModalProps extends ModalProps {
  sendTemplateId: number | string
  onOk?: () => void
}

export function SendTemplateDetailModal(props: SendTemplateDetailModalProps) {
  const { sendTemplateId, open, onCancel, onOk, ...rest } = props
  const context = useContext(GlobalContext)
  const sysTheme = context.theme
  const [detail, setDetail] = useState<SendTemplateItem>()

  const {
    run: runGetSendTemplateDetail,
    loading: getSendTemplateDetailLoading,
  } = useRequest(getTemplate, {
    manual: true,
    onSuccess: (res) => {
      setDetail(res.detail)
    },
  })

  const getSendTemplateDetail = useCallback(() => {
    if (!sendTemplateId) {
      return
    }
    runGetSendTemplateDetail(sendTemplateId)
  }, [sendTemplateId, runGetSendTemplateDetail])

  useEffect(() => {
    if (sendTemplateId && open) {
      getSendTemplateDetail()
    }
  }, [sendTemplateId, open, getSendTemplateDetail])

  if (!detail) {
    return null
  }

  const items: DescriptionsProps['items'] = [
    {
      label: '名称',
      children: detail?.name,
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '通知类型',
      children: (
        <Space direction='horizontal'>
          <Avatar
            size='small'
            shape='square'
            icon={AlarmSendTypeData[detail.sendType as AlarmSendType]?.icon}
          />
          {AlarmSendTypeData[detail.sendType as AlarmSendType]?.label}
        </Space>
      ),
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '状态',
      children: detail ? (
        <Badge
          color={StatusData[detail?.status as Status]?.color}
          text={StatusData[detail?.status as Status]?.text}
        />
      ) : (
        '-'
      ),
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '创建人',
      children: (
        <Tooltip title={detail?.creator?.nickname || detail?.creator?.name}>
          <div className='flex items-center gap-2'>
            <Avatar src={detail?.creator?.avatar}>
              {detail?.creator?.nickname || detail?.creator?.name}
            </Avatar>
            {detail?.creator?.nickname || detail?.creator?.name}
          </div>
        </Tooltip>
      ),
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '模板内容',
      children: detail?.content ? (
        <div className='relative max-h-[300px] overflow-auto'>
          <SyntaxHighlighter
            wrapLines
            wrapLongLines
            lineProps={() => ({
              style: {
                whiteSpace: 'pre-wrap',
              },
            })}
            style={
              sysTheme === 'dark' ? { ...atomOneDark } : { ...atomOneLight }
            }
            language={
              detail.sendType === AlarmSendType.AlarmSendTypeEmail
                ? 'html'
                : 'json'
            }
          >
            {detail?.content}
          </SyntaxHighlighter>
          <CopyOutlined
            className='absolute top-2 right-2 cursor-pointer text-blue-500'
            onClick={() => {
              navigator.clipboard.writeText(detail?.content).then(() => {
                message.success('复制成功')
              })
            }}
          />
        </div>
      ) : (
        '-'
      ),
      span: 4,
    },
    {
      label: '创建时间',
      children: detail?.createdAt,
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '更新时间',
      children: detail?.updatedAt,
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    },
    {
      label: '备注',
      children: detail?.remark || '-',
      span: 3,
    },
  ]

  return (
    <>
      <Modal
        {...rest}
        centered
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        loading={getSendTemplateDetailLoading}
      >
        <Descriptions title='通知模板信息' bordered items={items} />
      </Modal>
    </>
  )
}
