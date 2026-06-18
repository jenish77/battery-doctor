/**
 * API Services - Barrel Export
 *
 * Import all services from this file:
 * import { authService } from "@/lib/api";
 */

export { authService } from "./auth.service";
export { default as apiClient } from "./client";
export {
  setAuthTokens,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAdminUser,
  getAdminUser,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ADMIN_USER_KEY,
} from "./client";
