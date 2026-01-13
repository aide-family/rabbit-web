import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import TemplatePage from '@/pages/template'

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
          <Route path='/' element={<TemplatePage />} />
          <Route path='/*' element={<TemplatePage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
