import { Dropdown, type MenuProps } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { ReactNode } from 'react'

export interface MoreMenuProps {
  items: Array<{
    key: string
    label: ReactNode
  }>
  onClick?: (key: string) => void
}

export default function MoreMenu(props: MoreMenuProps) {
  const { items, onClick } = props

  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    label: item.label,
  }))

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: ({ key }) => onClick?.(key),
      }}
      trigger={['click']}
    >
      <Button type='link' size='small' icon={<MoreOutlined />}>
        更多
      </Button>
    </Dropdown>
  )
}
