import React, { useEffect, useState } from 'react'
import { listTemplate } from '@/api'
import { Button, Input, Table, TablePaginationConfig } from 'antd'
import { TemplateItem } from '@/api/template'

export default React.memo(function TemplatePage() {
  const [dataSource, setDataSource] = useState<TemplateItem[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '应用',
      dataIndex: 'app',
    },
  ]
  const pagination: TablePaginationConfig = {
    total,
    pageSize: pageSize,
    current: page,
    onChange: (page: number, pageSize: number) => {
      setPage(page as number)
      setPageSize(pageSize as number)
      getList()
    },
  }
  const getList = async () => {
    setLoading(true)
    const { items = [], total } = await listTemplate({
      page,
      pageSize,
      keyword: keyword || '',
    })
    setDataSource(items)
    setTotal(total)
    setLoading(false)
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <div className='p-4 flex flex-col gap-4'>
      <div className='flex justify-between gap-2'>
        <div className='flex gap-2'>
          <Input
            placeholder='关键词搜索'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setKeyword(e.target.value)
            }
            value={keyword}
            onPressEnter={getList}
            allowClear
          />
          <Button type='primary' onClick={getList}>
            搜索
          </Button>
        </div>
        <Button type='primary' onClick={() => {}}>
          新增
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='uid'
        pagination={pagination}
        size='small'
        loading={loading}
      />
    </div>
  )
})
