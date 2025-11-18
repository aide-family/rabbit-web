import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { namespaceService } from '../api/namespace'
import { NamespaceItem } from '../api/types'
import { message } from 'antd'

interface NamespaceContextType {
  currentNamespace: string | null
  namespaces: NamespaceItem[]
  loading: boolean
  setCurrentNamespace: (name: string | null) => void
  refreshNamespaces: () => Promise<void>
}

const NamespaceContext = createContext<NamespaceContextType | undefined>(
  undefined
)

export function NamespaceProvider({ children }: { children: ReactNode }) {
  const [currentNamespace, setCurrentNamespaceState] = useState<string | null>(
    () => localStorage.getItem('current_namespace')
  )
  const [namespaces, setNamespaces] = useState<NamespaceItem[]>([])
  const [loading, setLoading] = useState(false)

  const refreshNamespaces = async () => {
    try {
      setLoading(true)
      const res = await namespaceService.list({ page: 1, pageSize: 100 })
      setNamespaces(res.data.items)

      // 如果当前选中的 namespace 不存在了，清除选择
      if (currentNamespace) {
        const exists = res.data.items.some((ns) => ns.name === currentNamespace)
        if (!exists) {
          setCurrentNamespaceState(null)
          localStorage.removeItem('current_namespace')
        }
      }
    } catch (error) {
      console.error('Failed to load namespaces:', error)
      message.error('加载命名空间失败')
    } finally {
      setLoading(false)
    }
  }

  const setCurrentNamespace = (name: string | null) => {
    setCurrentNamespaceState(name)
    if (name) {
      localStorage.setItem('current_namespace', name)
    } else {
      localStorage.removeItem('current_namespace')
    }
  }

  useEffect(() => {
    refreshNamespaces()
  }, [])

  return (
    <NamespaceContext.Provider
      value={{
        currentNamespace,
        namespaces,
        loading,
        setCurrentNamespace,
        refreshNamespaces,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  )
}

export function useNamespace() {
  const context = useContext(NamespaceContext)
  if (context === undefined) {
    throw new Error('useNamespace must be used within a NamespaceProvider')
  }
  return context
}
