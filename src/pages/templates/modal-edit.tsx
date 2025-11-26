import { AlarmSendType, Status } from '@/api/enum'
import { templateService, type CreateTemplateRequest } from '@/api/template'
import type { TemplateItem } from '@/api/types'
import { TemplateAPP } from '@/api/types'
import { dingTalkTemplates } from '@/components/data/child/config/ding-talk'
import { feishuTemplates } from '@/components/data/child/config/feishu'
import { wechatTemplates } from '@/components/data/child/config/wechat'
import { DingTemplateEditor } from '@/components/data/child/template-editor-ding'
import { EmailTemplateEditor } from '@/components/data/child/template-editor-eamil'
import { FeishuTemplateEditor } from '@/components/data/child/template-editor-feishu'
import { JsonTemplateEditor } from '@/components/data/child/template-editor-json'
import { WechatTemplateEditor } from '@/components/data/child/template-editor-wechat'
import { DataFrom } from '@/components/data/form'
import { handleFormError } from '@/utils'
import { validateJson } from '@/utils/json'
import { useRequest } from 'ahooks'
import { Form, Input, message, Modal, Select, type ModalProps } from 'antd'
import { useEffect } from 'react'
import { editModalFormItems } from './options'

// 将 AlarmSendType 映射到 TemplateAPP
const mapAlarmSendTypeToTemplateAPP = (
  sendType: AlarmSendType
): TemplateAPP => {
  switch (sendType) {
    case AlarmSendType.AlarmSendTypeEmail:
      return TemplateAPP.TEMPLATE_APP_EMAIL
    case AlarmSendType.AlarmSendTypeDingTalk:
      return TemplateAPP.TEMPLATE_APP_WEBHOOK_DINGTALK
    case AlarmSendType.AlarmSendTypeWeChat:
      return TemplateAPP.TEMPLATE_APP_WEBHOOK_WECHAT
    case AlarmSendType.AlarmSendTypeFeiShu:
      return TemplateAPP.TEMPLATE_APP_WEBHOOK_FEISHU
    case AlarmSendType.AlarmSendTypeCustom:
      return TemplateAPP.TEMPLATE_APP_WEBHOOK_OTHER
    default:
      return TemplateAPP.TEMPLATE_APP_EMAIL
  }
}

// 将 TemplateAPP 映射到 AlarmSendType
const mapTemplateAPPToAlarmSendType = (app: TemplateAPP): AlarmSendType => {
  switch (app) {
    case TemplateAPP.TEMPLATE_APP_EMAIL:
      return AlarmSendType.AlarmSendTypeEmail
    case TemplateAPP.TEMPLATE_APP_WEBHOOK_DINGTALK:
      return AlarmSendType.AlarmSendTypeDingTalk
    case TemplateAPP.TEMPLATE_APP_WEBHOOK_WECHAT:
      return AlarmSendType.AlarmSendTypeWeChat
    case TemplateAPP.TEMPLATE_APP_WEBHOOK_FEISHU:
      return AlarmSendType.AlarmSendTypeFeiShu
    case TemplateAPP.TEMPLATE_APP_WEBHOOK_OTHER:
      return AlarmSendType.AlarmSendTypeCustom
    default:
      return AlarmSendType.AlarmSendTypeEmail
  }
}

export interface EditSendTemplateModalProps extends ModalProps {
  sendTemplateId?: string
  onOk?: () => void
  onCancel?: () => void
}

// 表单数据类型（使用 AlarmSendType 和 content）
type TemplateFormData = {
  name: string
  sendType: AlarmSendType
  status: number
  content: string
  templateType?: string
  remark?: string
}

export function EditSendTemplateModal(props: EditSendTemplateModalProps) {
  const { open, sendTemplateId, onOk, onCancel, ...rest } = props

  const [form] = Form.useForm<TemplateFormData>()
  const sendType = Form.useWatch<AlarmSendType>('sendType', form)

  const getTemplateDetail = async (uid: string) => {
    const res = await templateService.get(uid)
    const item: TemplateItem = res.data
    // 将 TemplateItem 转换为表单数据格式
    return {
      name: item.name,
      sendType: mapTemplateAPPToAlarmSendType(item.app),
      status:
        item.status === 'ENABLED' ? Status.StatusEnable : Status.StatusDisable,
      content: item.jsonData,
    }
  }

  const {
    run: initSendTemplateDetail,
    loading: initSendTemplateDetailLoading,
  } = useRequest(getTemplateDetail, {
    manual: true,
    onSuccess: (res) => {
      form?.setFieldsValue(res)
    },
  })

  const handleOnOk = async () => {
    try {
      const values = await form.validateFields()

      // 验证 JSON 格式（除了邮件和自定义类型）
      if (
        sendType !== AlarmSendType.AlarmSendTypeEmail &&
        sendType !== AlarmSendType.AlarmSendTypeCustom
      ) {
        const { isValid, error } = validateJson(values.content)
        if (!isValid) {
          message.error(`模板内容格式错误: ${error}`)
          return
        }
      }

      // 转换为 API 需要的格式
      const apiData: CreateTemplateRequest = {
        name: values.name,
        app: mapAlarmSendTypeToTemplateAPP(values.sendType),
        jsonData: values.content,
      }

      if (sendTemplateId) {
        await templateService.update(sendTemplateId, apiData)
        message.success('更新成功')
      } else {
        await templateService.create(apiData)
        message.success('创建成功')
      }

      form.resetFields()
      onOk?.()
    } catch (err: unknown) {
      handleFormError(form, err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        if (axiosError.response?.data?.message) {
          message.error(axiosError.response.data.message)
        }
      }
    }
  }

  const handleOnCancel = () => {
    onCancel?.()
  }

  useEffect(() => {
    if (sendTemplateId && open) {
      initSendTemplateDetail(sendTemplateId)
    }
    if (!open) {
      form.resetFields()
    }
  }, [sendTemplateId, open, initSendTemplateDetail, form])

  // 当 sendType 变化时，重置 templateType
  useEffect(() => {
    if (sendType && form) {
      form.setFieldsValue({
        templateType: undefined,
      })
    }
  }, [sendType, form])

  const getCendTypeContent = (t: AlarmSendType) => {
    const height = '40vh'
    switch (t) {
      case AlarmSendType.AlarmSendTypeFeiShu:
        return <FeishuTemplateEditor height={height} />
      case AlarmSendType.AlarmSendTypeDingTalk:
        return <DingTemplateEditor height={height} />
      case AlarmSendType.AlarmSendTypeWeChat:
        return <WechatTemplateEditor height={height} />
      case AlarmSendType.AlarmSendTypeCustom:
        return <JsonTemplateEditor height={height} />
      case AlarmSendType.AlarmSendTypeEmail:
        return <EmailTemplateEditor height={height} />
      default:
        return (
          <Input.TextArea rows={10} showCount placeholder='请输入模板内容' />
        )
    }
  }

  const getTemplateType = (t: AlarmSendType) => {
    let options: { label: string; value: string }[] = []
    switch (t) {
      case AlarmSendType.AlarmSendTypeFeiShu:
        options = feishuTemplates.map(
          (item: {
            name: string
            template: unknown
          }): { label: string; value: string } => ({
            label: item.name,
            value: JSON.stringify(item.template, null, 2),
          })
        )
        break
      case AlarmSendType.AlarmSendTypeDingTalk:
        options = dingTalkTemplates.map(
          (item: {
            name: string
            template: unknown
          }): { label: string; value: string } => ({
            label: item.name,
            value: JSON.stringify(item.template, null, 2),
          })
        )
        break
      case AlarmSendType.AlarmSendTypeWeChat:
        options = wechatTemplates.map(
          (item: {
            name: string
            template: unknown
          }): { label: string; value: string } => ({
            label: item.name,
            value: JSON.stringify(item.template, null, 2),
          })
        )
        break
    }
    return (
      <Select
        placeholder='请选择模板类型'
        options={options}
        disabled={!options.length}
        onChange={(value) => {
          if (form) {
            form.setFieldsValue({ content: value })
          }
        }}
      />
    )
  }

  return (
    <>
      <Modal
        {...rest}
        centered
        title={`${sendTemplateId ? '编辑' : '新增'}通知模板`}
        open={open}
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        loading={initSendTemplateDetailLoading}
      >
        {open && (
          <DataFrom
            items={editModalFormItems}
            props={{
              form,
              layout: 'vertical',
            }}
            slot={{
              content: getCendTypeContent(sendType),
              templateType: getTemplateType(sendType),
            }}
          />
        )}
      </Modal>
    </>
  )
}
