/**
 * Route path constants
 * Use these instead of hardcoding strings throughout the application
 */
export const ROUTES = {
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
  NOT_FOUND: '*'
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = typeof ROUTES[RouteKey]
