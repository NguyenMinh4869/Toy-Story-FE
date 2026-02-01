/**
 * Route path constants
 * Use these instead of hardcoding strings throughout the application
 */
export const ROUTES = {
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_PROMOTIONS: '/admin/promotions',
  ADMIN_SETS: '/admin/sets',
  ADMIN_VOUCHERS: '/admin/vouchers',
  ADMIN_WAREHOUSE: '/admin/warehouse',

  // Staff (mirrors Admin routes but with Staff-only access)
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_PRODUCTS: '/staff/products',
  STAFF_ORDERS: '/staff/orders',
  STAFF_BRANDS: '/staff/brands',
  STAFF_PROMOTIONS: '/staff/promotions',
  STAFF_SETS: '/staff/sets',
  STAFF_VOUCHERS: '/staff/vouchers',
  STAFF_WAREHOUSE: '/staff/warehouse',

  // Public
  HOME: '/',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Shop
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  CATEGORY: '/category/:category',
  BRANDS: '/brands',
  BRAND_DETAIL: '/brands/:id',
  
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  
  // User
  PROFILE: '/profile',
  ORDERS: '/orders',
  
  // Other
  CAM_NANG: '/cam-nang',
  CAM_NANG_DETAIL: '/cam-nang/:id',
  NOT_FOUND: '*'
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = typeof ROUTES[RouteKey]
