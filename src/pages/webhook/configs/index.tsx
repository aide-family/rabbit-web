import { useEffect, useState, useCallback } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
  Tag,
  theme,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { webhookService } from '../../../api/webhook'
import {
  WebhookItem,
  GlobalStatus,
  WebhookAPP,
  HTTPMethod,
} from '../../../api/types'
import { useNamespace } from '../../../contexts/NamespaceContext'
import AutoTable from '../../../components/Table'

export default function WebhookConfigs() {
  const [data, setData] = useState<WebhookItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<WebhookItem | null>(null)
  const [form] = Form.useForm()
  const { currentNamespace } = useNamespace()
  const { token } = theme.useToken()

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await webhookService.list({ page, pageSize, keyword })
      setData(res.data.items)
      setTotal(res.data.total)
    } catch {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, keyword])

  useEffect(() => {
    loadData()
  }, [loadData, currentNamespace])

  const handleCreate = () => {
    setEditingItem(null)
    form.resetFields()
    form.setFieldsValue({ method: HTTPMethod.POST, app: WebhookAPP.OTHER })
    setModalVisible(true)
  }

  const handleEdit = async (item: WebhookItem) => {
    setEditingItem(item)
    const res = await webhookService.get(item.uid)
    form.setFieldsValue(res.data)
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingItem) {
        await webhookService.update(editingItem.uid, values)
        message.success('更新成功')
        setModalVisible(false)
        setEditingItem(null)
        form.resetFields()
        await loadData()
      } else {
        await webhookService.create(values)
        message.success('创建成功')
        setModalVisible(false)
        setEditingItem(null)
        form.resetFields()
        // 创建成功后重置到第一页并清空搜索，让 useEffect 自动刷新
        setPage(1)
        setKeyword('')
        // 由于状态更新是异步的，需要手动触发一次加载
        // 使用新的参数直接加载
        try {
          setLoading(true)
          const res = await webhookService.list({
            page: 1,
            pageSize,
            keyword: '',
          })
          setData(res.data.items)
          setTotal(res.data.total)
        } catch {
          message.error('加载数据失败')
        } finally {
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  const handleDelete = async (uid: string) => {
    try {
      await webhookService.delete(uid)
      message.success('删除成功')
      loadData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleStatusToggle = async (item: WebhookItem) => {
    try {
      const newStatus =
        item.status === GlobalStatus.ENABLED
          ? GlobalStatus.DISABLED
          : GlobalStatus.ENABLED
      await webhookService.updateStatus(item.uid, newStatus)
      message.success('状态更新成功')
      loadData()
    } catch {
      message.error('状态更新失败')
    }
  }

  const columns = [
    { title: 'UID', dataIndex: 'uid', key: 'uid', width: 120, ellipsis: true },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: 'URL', dataIndex: 'url', key: 'url', ellipsis: true },
    {
      title: 'HTTP 方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: HTTPMethod) => {
        return <Tag>{method}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: GlobalStatus) =>
        status === GlobalStatus.ENABLED ? (
          <Tag color='success'>启用</Tag>
        ) : (
          <Tag color='default'>禁用</Tag>
        ),
    },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: WebhookItem) => (
        <Space>
          <Button type='link' size='small' onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => handleStatusToggle(record)}
          >
            {record.status === GlobalStatus.ENABLED ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title='确定删除？'
            onConfirm={() => handleDelete(record.uid)}
            okText='确定'
            cancelText='取消'
          >
            <Button type='link' danger size='small'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Input.Search
          placeholder='搜索名称'
          onSearch={setKeyword}
          style={{ width: 300 }}
          allowClear
        />
        <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
          新建 Webhook 配置
        </Button>
      </div>

      <AutoTable
        dataSource={data}
        columns={columns}
        rowKey='uid'
        loading={loading}
        total={total}
        pageSize={pageSize}
        pageNum={page}
        handleTurnPage={(p, ps) => {
          setPage(p)
          setPageSize(ps)
        }}
        showSizeChanger={true}
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
        }}
        size='middle'
      />

      <Modal
        title={editingItem ? '编辑 Webhook 配置' : '新建 Webhook 配置'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText='确定'
        cancelText='取消'
        width={600}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='名称'
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder='配置名称' />
          </Form.Item>
          <Form.Item
            name='url'
            label='URL'
            rules={[{ required: true, message: '请输入 URL' }]}
          >
            <Input placeholder='https://example.com/webhook' />
          </Form.Item>
          <Form.Item
            name='method'
            label='HTTP 方法'
            rules={[{ required: true, message: '请选择 HTTP 方法' }]}
          >
            <Select>
              <Select.Option value={HTTPMethod.GET}>GET</Select.Option>
              <Select.Option value={HTTPMethod.POST}>POST</Select.Option>
              <Select.Option value={HTTPMethod.PUT}>PUT</Select.Option>
              <Select.Option value={HTTPMethod.DELETE}>DELETE</Select.Option>
              <Select.Option value={HTTPMethod.PATCH}>PATCH</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='app'
            label='应用类型'
            rules={[{ required: true, message: '请选择应用类型' }]}
          >
            <Select>
              <Select.Option value={WebhookAPP.OTHER}>其他</Select.Option>
              <Select.Option value={WebhookAPP.DINGTALK}>钉钉</Select.Option>
              <Select.Option value={WebhookAPP.WECHAT}>微信</Select.Option>
              <Select.Option value={WebhookAPP.FEISHU}>飞书</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='secret' label='签名密钥'>
            <Input.Password placeholder='用于签名验证的密钥' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
