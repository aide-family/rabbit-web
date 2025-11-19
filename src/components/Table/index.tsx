import { Pagination, Table, TableProps } from 'antd'
import { ColumnGroupType, ColumnType } from 'antd/es/table'
import React from 'react'
import './index.css'

export type AutoTableColumnType<T> = ColumnType<T> | ColumnGroupType<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AutoTableProps<T = any> extends TableProps<T> {
  columns: AutoTableColumnType<T>[]
  dataSource: T[]
  total?: number
  handleTurnPage?: (page: number, pageSize: number) => void
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  pageSize?: number
  pageNum?: number
  style?: React.CSSProperties
  size?: 'large' | 'middle' | 'small'
}

export const AutoTable: React.FC<AutoTableProps> = (props) => {
  const {
    columns,
    dataSource,
    total,
    pageSize,
    pageNum,
    handleTurnPage,
    showQuickJumper,
    showSizeChanger,
    style,
    ...restProps
  } = props

  const showTotal = (total: number) => {
    return `共 ${total} 条`
  }

  return (
    <div className="a_table">
      <Table
        {...restProps}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={style}
      />
      {total && total > 0 ? (
        <Pagination
          className="a_table_pagination"
          total={total}
          onChange={(page, size) => handleTurnPage?.(page, size)}
          pageSize={pageSize}
          defaultCurrent={1}
          current={pageNum}
          showQuickJumper={showQuickJumper}
          showSizeChanger={showSizeChanger}
          showTotal={showTotal}
        />
      ) : null}
    </div>
  )
}

export default AutoTable

