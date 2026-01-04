import { useState } from 'react'
import Layout from './components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ApiPage from './pages/ApiPage'
import ExamplesPage from './pages/ExamplesPage'

type Page = 'home' | 'api' | 'examples'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />
      case 'api':
        return <ApiPage />
      case 'examples':
        return <ExamplesPage />
      default:
        return <HomePage onPageChange={setCurrentPage} />
    }
  }

  return (
    <Layout>
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer />
    </Layout>
  )
}

export default App
