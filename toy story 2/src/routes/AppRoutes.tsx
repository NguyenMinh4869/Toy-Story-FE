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
import VoucherPage from '../pages/VoucherPage'
import SetPage from '../pages/SetPage'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage'
import ProductManagementPage from '../pages/admin/ProductManagementPage'
import StaffManagementPage from '../pages/admin/StaffManagementPage'
import BrandManagementPage from '../pages/admin/BrandManagementPage'
import PromotionManagementPage from '../pages/admin/PromotionManagementPage'
import SetManagementPage from '../pages/admin/SetManagementPage'
import VoucherManagementPage from '../pages/admin/VoucherManagementPage'
import WarehouseManagementPage from '../pages/admin/WarehouseManagementPage'

// Staff Pages
import StaffDashboardPage from '../pages/staff/StaffDashboardPage'
import StaffBrandManagementPage from '../pages/staff/StaffBrandManagementPage'
import StaffSetManagementPage from '../pages/staff/StaffSetManagementPage'
import StaffPromotionManagementPage from '../pages/staff/StaffPromotionManagementPage'
import StaffWarehouseManagementPage from '../pages/staff/StaffWarehouseManagementPage'

// User Pages
import ProfilePage from '../pages/ProfilePage'
import OrderHistoryPage from '../pages/OrderHistoryPage'
import WishlistPage from '../pages/WishlistPage'
import ChangePasswordPage from '../pages/ChangePasswordPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      
      {/* Admin Routes - Admin Only */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardLayout mode="admin"><DashboardPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<DashboardLayout mode="admin"><ProductManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_STAFF} element={<DashboardLayout mode="admin"><StaffManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_BRANDS} element={<DashboardLayout mode="admin"><BrandManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_PROMOTIONS} element={<DashboardLayout mode="admin"><PromotionManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_SETS} element={<DashboardLayout mode="admin"><SetManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_VOUCHERS} element={<DashboardLayout mode="admin"><VoucherManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_WAREHOUSE} element={<DashboardLayout mode="admin"><WarehouseManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<DashboardLayout mode="admin"><div>Orders Page (Under Construction)</div></DashboardLayout>} />
      </Route>

      {/* Staff Routes - Staff Only */}
      <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
        <Route path={ROUTES.STAFF_DASHBOARD} element={<DashboardLayout mode="staff"><StaffDashboardPage /></DashboardLayout>} />
        <Route path={ROUTES.STAFF_BRANDS} element={<DashboardLayout mode="staff"><StaffBrandManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.STAFF_PROMOTIONS} element={<DashboardLayout mode="staff"><StaffPromotionManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.STAFF_SETS} element={<DashboardLayout mode="staff"><StaffSetManagementPage /></DashboardLayout>} />
        <Route path={ROUTES.STAFF_WAREHOUSE} element={<DashboardLayout mode="staff"><StaffWarehouseManagementPage /></DashboardLayout>} />
      </Route>

      {/* Member/User Routes - All authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'Member']} />}>
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.PROFILE_ORDERS} element={<OrderHistoryPage />} />
        <Route path={ROUTES.PROFILE_WISHLIST} element={<WishlistPage />} />
        <Route path={ROUTES.PROFILE_CHANGE_PASSWORD} element={<ChangePasswordPage />} />
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

      {/* Voucher Route (FR-3: customer-filter) */}
      <Route path={ROUTES.VOUCHERS} element={<VoucherPage />} />

      {/* Set Route (FR-5: customer-filter) */}
      <Route path={ROUTES.SETS} element={<SetPage />} />
      
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
