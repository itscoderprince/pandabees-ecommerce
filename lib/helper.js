import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/token";

/**
 * Standard API response formatter.
 */
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode },
  );
};

/**
 * Higher-order function to wrap API routes with centralized error handling.
 */
export const wrapRoute = (handler) => {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error("❌ API Error:", error);
      
      const message = error.message || "An unexpected system error occurred.";
      const status = error.statusCode || 500;
      
      return response(false, status, message);
    }
  };
};

/**
 * Authenticate a request and verify user details.
 * @param {string} role - Optional role to check for (e.g., 'admin')
 * @returns {Object|null} - Decoded user payload or null if unauthorized
 */
export const isAuthenticated = async (role = null) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const decoded = await verifyToken(token);
    
    // If a specific role is required, check it
    if (role && decoded?.role !== role) {
      return null;
    }

    return decoded;
  } catch (err) {
    console.error("Auth helper error:", err);
    return null;
  }
};

/**
 * Generates a standard 6-digit OTP.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
