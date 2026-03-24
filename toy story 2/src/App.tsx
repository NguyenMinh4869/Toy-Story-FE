import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import LoginPage from './pages/LoginPage'
import CartPopup from './components/CartPopup'
import { ROUTES } from './routes/routePaths'
import RegisterPage from './pages/RegisterPage'
import { Toaster } from './components/ui/toaster' // Import your Toaster
import { ToastInitializer } from './components/ToastInitializer'

const App: React.FC = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === ROUTES.LOGIN
  const isRegister = location.pathname === ROUTES.REGISTER

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isStaffRoute = location.pathname.startsWith('/staff')

  // If it's login page, render it separately without layout
  if (isLoginPage) {
    return (
      <>
        <ToastInitializer />
        <LoginPage />
        <Toaster />
      </>
    )
  }

  if (isRegister) {
    return (
      <>
        <ToastInitializer />
        <RegisterPage />
        <Toaster />
      </>
    )
  }

  // If it's admin or staff page, render it without public layout
  if (isAdminRoute || isStaffRoute) {
    return (
      <>
        <ToastInitializer />
        <AppRoutes />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <ToastInitializer />
      <div className="bg-[#ab0007] min-h-screen w-full">
        <Header />
        <main className="w-full">
          <AppRoutes />
        </main>
        <Footer />
        <CartPopup />
      </div>
      <Toaster />
    </>
  )
}

export default App