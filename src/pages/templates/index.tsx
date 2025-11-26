import { AlarmSendType, Status } from '@/api/enum'
import { ActionKey } from '@/api/global'
import { templateService, type ListTemplateParams } from '@/api/template'
import type { TemplateItem } from '@/api/types'
import { GlobalStatus, TemplateAPP } from '@/api/types'
import type { SendTemplateItem } from '@/api/request/types/model-types'
import SearchBox from '@/components/data/search-box'
import AutoTable from '@/components/Table/index'
import { useContainerHeightTop } from '@/hooks/useContainerHeightTop'
import { GlobalContext } from '@/utils/context'
import { useRequest } from 'ahooks'
import { Button, message, Space, theme } from 'antd'
import type React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { SendTemplateDetailModal } from './modal-detail'
import { EditSendTemplateModal } from './modal-edit'
import { formList, getColumnList } from './options'

const { useToken } = theme

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

// 将 TemplateItem 转换为 SendTemplateItem
const convertTemplateItemToSendTemplateItem = (
  item: TemplateItem,
  index: number
): SendTemplateItem => {
  return {
    id: item.uid ? item.uid : index + 1, // 临时使用索引作为 id，实际应该从后端获取 uid
    name: item.name,
    sendType: mapTemplateAPPToAlarmSendType(item.app),
    status:
      item.status === GlobalStatus.ENABLED
        ? Status.StatusEnable
        : Status.StatusDisable,
    content: item.jsonData,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
  }
}

// 搜索参数类型
type GetTemplateListRequest = {
  pagination: {
    page: number
    pageSize: number
    pageNum?: number
  }
  keyword?: string
  status?: number
  sendTypes?: number[]
}

// API 请求函数
const getTemplateList = async (
  params: ListTemplateParams | GetTemplateListRequest
) => {
  const apiParams: ListTemplateParams = {
    page:
      'pagination' in params
        ? params.pagination.pageNum || params.pagination.page
        : params.page || 1,
    pageSize:
      'pagination' in params
        ? params.pagination.pageSize
        : params.pageSize || 50,
    keyword: params.keyword,
  }
  if ('status' in params && params.status) {
    apiParams.status =
      params.status === Status.StatusEnable
        ? GlobalStatus.ENABLED
        : GlobalStatus.DISABLED
  }
  const res = await templateService.list(apiParams)
  return {
    list: res.data.items.map(convertTemplateItemToSendTemplateItem),
    pagination: {
      total: res.data.total,
      page: res.data.page,
      pageSize: res.data.pageSize,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteTemplate = async (_id: number | string) => {
  // 注意：这里需要根据实际的 id 找到对应的 uid
  message.warning('删除功能需要传入 uid，请使用正确的 API')
  return Promise.resolve()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateTemplateStatus = async (_params: {
  ids: (number | string)[]
  status: Status
}) => {
  // 注意：这里需要根据实际的 id 找到对应的 uid
  message.warning('更新状态功能需要传入 uid，请使用正确的 API')
  return Promise.resolve()
}

const Template: React.FC = () => {
  const { token } = useToken()
  const { isFullscreen } = useContext(GlobalContext)

  const [datasource, setDatasource] = useState<SendTemplateItem[]>([])
  const [total, setTotal] = useState(0)
  const [searchParams, setSearchParams] = useState<GetTemplateListRequest>({
    pagination: {
      page: 1,
      pageSize: 50,
      pageNum: 1,
    },
  })
  const [showModal, setShowModal] = useState(false)
  const [SendTemplateDetail, setSendTemplateDetail] =
    useState<SendTemplateItem>()
  const [openDetailModal, setOpenDetailModal] = useState(false)

  const ADivRef = useRef<HTMLDivElement>(null)
  const AutoTableHeight = useContainerHeightTop(
    ADivRef,
    datasource,
    isFullscreen
  )

  const onOpenDetailModal = (item: SendTemplateItem) => {
    setSendTemplateDetail(item)
    setOpenDetailModal(true)
  }

  const onCloseDetailModal = () => {
    setOpenDetailModal(false)
    setSendTemplateDetail(undefined)
  }

  const onSearch = (values: GetTemplateListRequest) => {
    setSearchParams({
      ...searchParams,
      ...values,
    })
  }

  const { run: runGetTemplateList, loading: getTemplateListLoading } =
    useRequest(getTemplateList, {
      manual: true,
      onSuccess: (res: {
        list?: SendTemplateItem[]
        pagination?: { total?: number }
      }) => {
        console.log('res', res)
        setDatasource(res?.list || [])
        setTotal(res?.pagination?.total || 0)
      },
    })

  const onReset = () => {
    setSearchParams({
      pagination: {
        page: 1,
        pageSize: 50,
      },
    })
  }

  const handleEditModal = (detail?: SendTemplateItem) => {
    setShowModal(true)
    setSendTemplateDetail(detail)
  }

  const onRefresh = () => {
    runGetTemplateList(searchParams)
  }

  const handleDelete = (id: number | string) => {
    deleteTemplate(id).then(onRefresh)
  }

  const onChangeStatus = (SendTemplateId: number | string, status: Status) => {
    updateTemplateStatus({ ids: [SendTemplateId], status }).then(onRefresh)
  }

  const onHandleMenuOnClick = (item: SendTemplateItem, key: ActionKey) => {
    switch (key) {
      case ActionKey.EDIT:
        handleEditModal(item)
        break
      case ActionKey.DELETE:
        handleDelete(item.id)
        break
      case ActionKey.DETAIL:
        console.log('item', item)
        console.log('datasource', datasource)
        onOpenDetailModal(item)
        break
      case ActionKey.DISABLE:
        onChangeStatus(item.id, Status.StatusDisable)
        break
      case ActionKey.ENABLE:
        onChangeStatus(item.id, Status.StatusEnable)
        break
      default:
        break
    }
  }

  const handleTurnPage = (pageNum: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      pagination: {
        ...searchParams.pagination,
        page: pageNum,
        pageNum,
        pageSize,
      },
    })
  }

  const closeEditSendTemplateModal = () => {
    setShowModal(false)
  }

  const handleEditSendTemplateModalOnOk = () => {
    setShowModal(false)
    onRefresh()
  }

  const columns = getColumnList({
    onHandleMenuOnClick,
    current: searchParams.pagination.pageNum || searchParams.pagination.page,
    pageSize: searchParams.pagination.pageSize,
  })

  useEffect(() => {
    const params: ListTemplateParams = {
      page: searchParams.pagination.pageNum || searchParams.pagination.page,
      pageSize: searchParams.pagination.pageSize,
      keyword: searchParams.keyword,
    }
    if (searchParams.status) {
      params.status =
        searchParams.status === Status.StatusEnable
          ? GlobalStatus.ENABLED
          : GlobalStatus.DISABLED
    }
    runGetTemplateList(params)
  }, [searchParams, runGetTemplateList])

  return (
    <>
      <EditSendTemplateModal
        width='50%'
        open={showModal}
        sendTemplateId={
          SendTemplateDetail?.id ? String(SendTemplateDetail.id) : undefined
        }
        onCancel={closeEditSendTemplateModal}
        onOk={handleEditSendTemplateModalOnOk}
      />
      <SendTemplateDetailModal
        width='50%'
        sendTemplateId={SendTemplateDetail?.id || 0}
        open={openDetailModal}
        onCancel={onCloseDetailModal}
        onOk={onCloseDetailModal}
      />
      <div className='flex flex-col gap-3 p-3'>
        <div
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
          }}
        >
          <SearchBox
            formList={formList}
            onSearch={onSearch}
            onReset={onReset}
          />
        </div>
        <div
          className='p-3'
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
          }}
        >
          <div className='flex justify-between items-center'>
            <div className='text-lg font-bold'>通知模板</div>
            <Space size={8}>
              <Button type='primary' onClick={() => handleEditModal()}>
                添加
              </Button>
              <Button color='default' variant='filled' onClick={onRefresh}>
                刷新
              </Button>
            </Space>
          </div>
          <div className='mt-4' ref={ADivRef}>
            <AutoTable
              rowKey={(record: SendTemplateItem) => String(record.id)}
              dataSource={datasource}
              total={total}
              loading={getTemplateListLoading}
              columns={columns}
              handleTurnPage={handleTurnPage}
              pageSize={searchParams.pagination.pageSize}
              pageNum={
                searchParams.pagination.pageNum || searchParams.pagination.page
              }
              showSizeChanger={true}
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
              }}
              scroll={{
                y: `calc(100vh - 170px  - ${AutoTableHeight}px)`,
                x: 1000,
              }}
              size='middle'
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Template
