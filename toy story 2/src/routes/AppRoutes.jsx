import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
// Import other pages as you create them:
// import RegisterPage from '../pages/RegisterPage'
// import ProductListPage from '../pages/ProductListPage'
// import ProductDetailPage from '../pages/ProductDetailPage'
// import CartPage from '../pages/CartPage'
// import CheckoutPage from '../pages/CheckoutPage'
// import ProfilePage from '../pages/ProfilePage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      
      {/* Shop Routes */}
      {/* <Route path="/products" element={<ProductListPage />} /> */}
      {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
      {/* <Route path="/category/:category" element={<ProductListPage />} /> */}
      
      {/* Cart & Checkout */}
      {/* <Route path="/cart" element={<CartPage />} /> */}
      {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      
      {/* User Routes */}
      {/* <Route path="/profile" element={<ProfilePage />} /> */}
      {/* <Route path="/orders" element={<OrdersPage />} /> */}
      
      {/* 404 - Keep at the end */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default AppRoutes

