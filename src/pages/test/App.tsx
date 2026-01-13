import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import TestPage from '@/pages/test'

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: { colorPrimary: '#6c34e6' },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TestPage />} />
          <Route path='/*' element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
