/**
 * Centralized Website (Public/User) route configurations.
 */
export const WEBSITE_ROUTES = {
  HOME: "/",
  
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password", // If separate
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  // User Protected Area
  USER: {
    DASHBOARD: "/my-account",
    ORDERS: "/my-account/orders",
    PROFILE: "/my-account/profile",
    ADDRESSES: "/my-account/addresses",
  }
};
