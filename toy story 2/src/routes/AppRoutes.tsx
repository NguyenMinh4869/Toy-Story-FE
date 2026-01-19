import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import { ROUTES } from './routePaths'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      {/* <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}
      
      {/* Product Routes */}
      <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
      {/* <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} /> */}
      {/* <Route path={ROUTES.CATEGORY} element={<ProductListPage />} /> */}
      
      {/* Cart & Checkout */}
      {/* <Route path={ROUTES.CART} element={<CartPage />} /> */}
      {/* <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} /> */}
      
      {/* User Routes */}
      {/* <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> */}
      {/* <Route path={ROUTES.ORDERS} element={<OrdersPage />} /> */}
      
      {/* 404 - Keep at the end */}
      {/* <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default AppRoutes
