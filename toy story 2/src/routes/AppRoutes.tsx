import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import { BrandPage } from '../pages/BrandPage'
import ProductsPage from '../pages/ProductsPage'
import CamNangPage from '../pages/CamNangPage'
import CamNangDetailPage from '../pages/CamNangDetailPage'
import { ROUTES } from './routePaths'
import PromotionPage from '../pages/PromotionPage'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import DashboardPage from '../pages/admin/DashboardPage'
import ProductManagementPage from '../pages/admin/ProductManagementPage'
import StaffManagementPage from '../pages/admin/StaffManagementPage'
import BrandManagementPage from '../pages/admin/BrandManagementPage'
import PromotionManagementPage from '../pages/admin/PromotionManagementPage'
import SetManagementPage from '../pages/admin/SetManagementPage'
import VoucherManagementPage from '../pages/admin/VoucherManagementPage'
import WarehouseManagementPage from '../pages/admin/WarehouseManagementPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminLayout><DashboardPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminLayout><ProductManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_STAFF} element={<AdminLayout><StaffManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_BRANDS} element={<AdminLayout><BrandManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_PROMOTIONS} element={<AdminLayout><PromotionManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_SETS} element={<AdminLayout><SetManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_VOUCHERS} element={<AdminLayout><VoucherManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_WAREHOUSE} element={<AdminLayout><WarehouseManagementPage /></AdminLayout>} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<AdminLayout><div>Orders Page (Under Construction)</div></AdminLayout>} />
      </Route>

      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      {/* <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}
      
      {/* Product Routes */}
      <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
      <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
      {/* <Route path={ROUTES.CATEGORY} element={<ProductListPage />} /> */}
      
      {/* Brand Routes */}
      <Route path={ROUTES.BRANDS} element={<BrandPage />} />
      {/* <Route path={ROUTES.BRAND_DETAIL} element={<BrandDetailPage />} /> */}

      {/* Promotion Route */}
      <Route path="/promotion" element={<PromotionPage />} />
      
      {/* Other Pages */}
      <Route path={ROUTES.CAM_NANG} element={<CamNangPage />} />
      <Route path={ROUTES.CAM_NANG_DETAIL} element={<CamNangDetailPage />} />
      
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
