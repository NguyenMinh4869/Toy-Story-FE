import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import LoginPage from './pages/LoginPage'
import CartPopup from './components/CartPopup'
import { ROUTES } from './routes/routePaths'

const App: React.FC = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === ROUTES.LOGIN
  const isAdminRoute = location.pathname.startsWith('/admin')

  // If it's login page, render it separately without layout
  if (isLoginPage) {
    return <LoginPage />
  }

  // If it's admin page, render it without public layout
  if (isAdminRoute) {
    return <AppRoutes />
  }

  return (
    <div className="bg-[#ab0007] min-h-screen w-full">
      <Header />
      <main className="w-full">
        <AppRoutes />
      </main>
      <Footer />
      <CartPopup />
    </div>
  )
}

export default App
