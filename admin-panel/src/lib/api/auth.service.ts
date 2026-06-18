/**
 * Authentication Service
 *
 * Handles all authentication-related API calls:
 * - POST /admin/auth/v1/login
 * - DELETE /admin/auth/v1/logout
 * - POST /admin/auth/v1/refresh_token
 */

import { LoginRequest, LoginResponse, RefreshTokenResponse } from "@/types";
import apiClient, {
  clearAuthTokens,
  setAdminUser,
  setAuthTokens,
} from "./client";

export const authService = {
  /**
   * Login with email and password
   * Stores tokens and admin user info on success
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: LoginRequest = {
      email,
      password,
      pushToken: "web-admin-panel",
      deviceInfo: {
        device: "web",
      },
    };

    const response = await apiClient.post<{ response: LoginResponse }>(
      "/admin/auth/v1/login",
      payload
    );

    const data = response.data.response;

    // Store tokens securely
    setAuthTokens(data.accessToken, data.refreshToken);

    // Store admin user info
    setAdminUser(data.admin);

    return data;
  },

  /**
   * Logout - invalidates the current session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.delete("/admin/auth/v1/logout");
    } catch {
      // Even if API call fails, clear local tokens
      console.warn("Logout API call failed, clearing local tokens");
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * Refresh access token using refresh token
   * This is called automatically by the Axios interceptor
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<{ response: RefreshTokenResponse }>(
      "/admin/auth/v1/refresh_token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const data = response.data.response;

    // Update stored tokens
    setAuthTokens(data.accessToken, data.refreshToken);

    return data;
  },
};
