import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { API } from '@/pages/API'
import { Examples } from '@/pages/Examples'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/api" element={<API />} />
              <Route path="/examples" element={<Examples />} />
            </Routes>
          </main>
          <Footer />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
