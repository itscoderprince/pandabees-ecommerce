/**
 * Centralized Administrative route configurations.
 */
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",

  // E-commerce Core
  PRODUCTS: "/admin/products",
  CATEGORIES: "/admin/categories",
  ORDERS: "/admin/orders",
  CUSTOMERS: "/admin/customers",

  // Site Content
  BANNERS: "/admin/banners",
  MEIDA: "/admin/media",
  COUPONS: "/admin/coupons",
  FAQS: "/admin/faqs",

  // Settings
  SETTINGS: "/admin/settings",
  ANALYTICS: "/admin/analytics",
};

export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit${id}` : "");
