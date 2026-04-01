/**
 * Route path constants
 * Use these instead of hardcoding strings throughout the application
 */
export const ROUTES = {
  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: "/admin/orders/:orderId",
  ADMIN_INVOICES: "/admin/invoices",

  ADMIN_BRANDS: "/admin/brands",
  ADMIN_PROMOTIONS: "/admin/promotions",
  ADMIN_SETS: "/admin/sets",
  ADMIN_VOUCHERS: "/admin/vouchers",
  ADMIN_ARTICLES: "/admin/articles",
  ADMIN_ARTICLE_CATEGORIES: "/admin/article-categories",
  ADMIN_WAREHOUSE: "/admin/warehouse",
  ADMIN_EVENT: "/admin/event",
  ADMIN_TRANSFER: "/admin/transfer",

  // Staff (mirrors Admin routes but with Staff-only access)
  STAFF_DASHBOARD: "/staff/dashboard",
  STAFF_PRODUCTS: "/staff/products",
  STAFF_ORDERS: "/staff/orders",
  STAFF_ORDER_DETAIL: "/staff/orders/:orderId",
  STAFF_BRANDS: "/staff/brands",
  STAFF_PROMOTIONS: "/staff/promotions",
  STAFF_SETS: "/staff/sets",
  STAFF_VOUCHERS: "/staff/vouchers",
  STAFF_ARTICLES: "/staff/articles",
  STAFF_ARTICLE_CATEGORIES: "/staff/article-categories",
  STAFF_WAREHOUSE: "/staff/warehouse",
  STAFF_EVENT: "/staff/event",
  STAFF_TRANSFER: "/staff/transfer",

  // Public
  HOME: "/",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // Shop
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/product/:id",
  CATEGORY: "/category/:category",
  BRANDS: "/brands",
  BRAND_DETAIL: "/brands/:id",
  VOUCHERS: "/vouchers",
  SETS: "/sets",
  SET_DETAIL: "/sets/:id",

  // Cart & Checkout
  CART: "/cart",
  CHECKOUT: "/checkout",

  CANCEL: "payments/cancel",
  SUCCESS: "payments/success",

  // User
  PROFILE: "/profile",
  PROFILE_INVOICES: "/profile/invoices",
  PROFILE_ORDERS: "/profile/orders",
  PROFILE_ORDER_DETAIL: "/profile/orders/:orderId",
  PROFILE_WISHLIST: "/profile/wishlist",
  PROFILE_ADDRESSES: "/profile/addresses",
  PROFILE_CHANGE_PASSWORD: "/profile/change-password",
  ORDERS: "/orders",

  // Other
  CAM_NANG: "/cam-nang",
  CAM_NANG_DETAIL: "/cam-nang/:id",
  NOT_FOUND: "*",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export type OrderDetailRole = "customer" | "admin" | "staff";

export function toOrderDetailPath(orderId: number, role: OrderDetailRole): string {
  const id = String(orderId);
  if (role === "admin") return `/admin/orders/${id}`;
  if (role === "staff") return `/staff/orders/${id}`;
  return `/profile/orders/${id}`;
}
