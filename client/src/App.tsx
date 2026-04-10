import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Builder from '@/pages/Builder'
import Templates from '@/pages/Templates'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
