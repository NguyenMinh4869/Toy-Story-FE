import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import { BrandPage } from "../pages/BrandPage";
import BrandDetailPage from "../pages/BrandDetailPage";
import ProductsPage from "../pages/ProductsPage";
import CamNangPage from "../pages/CamNangPage";
import CamNangDetailPage from "../pages/CamNangDetailPage";
import { ROUTES } from "./routePaths";
import PromotionPage from "../pages/PromotionPage";
import VoucherPage from "../pages/VoucherPage";
import SetPage from "../pages/SetPage";
import SetDetailPage from "../pages/SetDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Admin Pages
import ArticleManagementPage from "../pages/admin/ArticleManagementPage";
import ArticleCategoryManagementPage from "../pages/admin/ArticleCategoryManagementPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import StaffManagementPage from "../pages/admin/StaffManagementPage";
import BrandManagementPage from "../pages/admin/BrandManagementPage";
import PromotionManagementPage from "../pages/admin/PromotionManagementPage";
import SetManagementPage from "../pages/admin/SetManagementPage";
import VoucherManagementPage from "../pages/admin/VoucherManagementPage";
import WarehouseManagementPage from "../pages/admin/WarehouseManagementPage";

// Staff Pages
import StaffDashboardPage from "../pages/staff/StaffDashboardPage";
import StaffBrandManagementPage from "../pages/staff/StaffBrandManagementPage";
import StaffSetManagementPage from "../pages/staff/StaffSetManagementPage";
import StaffPromotionManagementPage from "../pages/staff/StaffPromotionManagementPage";
import StaffWarehouseManagementPage from "../pages/staff/StaffWarehouseManagementPage";

// User Pages
import ProfilePage from "../pages/ProfilePage";
import InvoicePage from "../pages/InvoicePage";
import WishlistPage from "../pages/WishlistPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

import RegisterPage from "../pages/RegisterPage";
import PaymentCancelPage from "@/pages/payment/CancelPage";
import PaymentSuccessPage from "@/pages/payment/SuccessPage";
import OrderPage from "@/pages/OrderPage";
import InvoiceManagementPage from "@/pages/admin/InvoiceManagementPage";
import OrderManagementPage from "@/pages/admin/OrderManagementPage";
import StaffOrderManagementPage from "@/pages/staff/StaffOrderManagementPage";
import EventHistoryPage from "@/pages/EventHistoryPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* Admin Routes - Admin Only */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <DashboardLayout mode="admin">
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_PRODUCTS}
          element={
            <DashboardLayout mode="admin">
              <ProductManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_STAFF}
          element={
            <DashboardLayout mode="admin">
              <StaffManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_BRANDS}
          element={
            <DashboardLayout mode="admin">
              <BrandManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_PROMOTIONS}
          element={
            <DashboardLayout mode="admin">
              <PromotionManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_SETS}
          element={
            <DashboardLayout mode="admin">
              <SetManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_VOUCHERS}
          element={
            <DashboardLayout mode="admin">
              <VoucherManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_WAREHOUSE}
          element={
            <DashboardLayout mode="admin">
              <WarehouseManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_ORDERS}
          element={
            <DashboardLayout mode="admin">
              <OrderManagementPage />
            </DashboardLayout>
          }
        />

        <Route
          path={ROUTES.ADMIN_ARTICLES}
          element={
            <DashboardLayout mode="admin">
              <ArticleManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_ARTICLE_CATEGORIES}
          element={
            <DashboardLayout mode="admin">
              <ArticleCategoryManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_INVOICES}
          element={
            <DashboardLayout mode="admin">
              <InvoiceManagementPage />
            </DashboardLayout>
          }
        />

        <Route
          path={ROUTES.ADMIN_EVENT}
          element={
            <DashboardLayout mode="admin">
              <EventHistoryPage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Staff Routes - Staff Only */}
      <Route element={<ProtectedRoute allowedRoles={["Staff"]} />}>
        <Route
          path={ROUTES.STAFF_DASHBOARD}
          element={
            <DashboardLayout mode="staff">
              <StaffDashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_BRANDS}
          element={
            <DashboardLayout mode="staff">
              <StaffBrandManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_PROMOTIONS}
          element={
            <DashboardLayout mode="staff">
              <StaffPromotionManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_SETS}
          element={
            <DashboardLayout mode="staff">
              <StaffSetManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_WAREHOUSE}
          element={
            <DashboardLayout mode="staff">
              <StaffWarehouseManagementPage />
            </DashboardLayout>
          }
        />

        <Route
          path={ROUTES.STAFF_ARTICLES}
          element={
            <DashboardLayout mode="staff">
              <ArticleManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_ARTICLE_CATEGORIES}
          element={
            <DashboardLayout mode="staff">
              <ArticleCategoryManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ROUTES.STAFF_ORDERS}
          element={
            <DashboardLayout mode="staff">
              <StaffOrderManagementPage />
            </DashboardLayout>
          }
        />

        <Route
          path={ROUTES.STAFF_EVENT}
          element={
            <DashboardLayout mode="staff">
              <EventHistoryPage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Member/User Routes - All authenticated users */}
      <Route
        element={<ProtectedRoute allowedRoles={["Admin", "Staff", "Member", "Customer"]} />}
      >
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.PROFILE_INVOICES} element={<InvoicePage />} />
        <Route path={ROUTES.PROFILE_ORDERS} element={<OrderPage />} />

        <Route path={ROUTES.PROFILE_WISHLIST} element={<WishlistPage />} />
        <Route
          path={ROUTES.PROFILE_CHANGE_PASSWORD}
          element={<ChangePasswordPage />}
        />
      </Route>

      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Product Routes */}
      <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
      <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
      {/* <Route path={ROUTES.CATEGORY} element={<ProductListPage />} /> */}

      {/* Brand Routes */}
      <Route path={ROUTES.BRANDS} element={<BrandPage />} />
      <Route path={ROUTES.BRAND_DETAIL} element={<BrandDetailPage />} />

      {/* Promotion Route */}
      <Route path="/promotion" element={<PromotionPage />} />

      {/* Voucher Route (FR-3: customer-filter) */}
      <Route path={ROUTES.VOUCHERS} element={<VoucherPage />} />

      {/* Set Route (FR-5: customer-filter) */}
      <Route path={ROUTES.SETS} element={<SetPage />} />
      <Route path={ROUTES.SET_DETAIL} element={<SetDetailPage />} />

      {/* Other Pages */}
      <Route path={ROUTES.CAM_NANG} element={<CamNangPage />} />
      <Route path={ROUTES.CAM_NANG_DETAIL} element={<CamNangDetailPage />} />

      {/* Cart & Checkout */}
      <Route path={ROUTES.CART} element={<CartPage />} />
      <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />

      <Route path={ROUTES.CANCEL} element={<PaymentCancelPage />} />
      <Route path={ROUTES.SUCCESS} element={<PaymentSuccessPage />} />

      {/* 404 - catch-all for unmatched routes */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page not found</p>
            <a href="/" className="text-red-600 hover:underline">
              ← Back to Home
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
