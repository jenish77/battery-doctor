/**
 * Axios API Client with Token Auto-Refresh
 *
 * Features:
 * - Automatic Bearer token injection on all requests
 * - Auto refresh token when 401 is received
 * - Request/Response interceptors for error handling
 * - Environment and device headers injected automatically
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

// Cookie keys for token storage
export const ACCESS_TOKEN_KEY = "bd_access_token";
export const REFRESH_TOKEN_KEY = "bd_refresh_token";
export const ADMIN_USER_KEY = "bd_admin_user";

// API Base URL - Use relative path to go through Next.js proxy (avoids CORS)
// In production, you can set this to your actual API URL if CORS is configured
const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api" // Client-side: use Next.js proxy to avoid CORS
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "https://batterydoctor.elvee.app/api"); // Server-side: direct call

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ============================================================
// Request Interceptor
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject Bearer token
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Inject required custom headers
    config.headers["env"] = process.env.NEXT_PUBLIC_ENV || "test";
    config.headers["x-device"] = process.env.NEXT_PUBLIC_DEVICE || "web";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// Response Interceptor - Auto Token Refresh on 401
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh token or login endpoints
      if (
        originalRequest.url?.includes("/auth/v1/refresh_token") ||
        originalRequest.url?.includes("/auth/v1/login")
      ) {
        // Clear tokens and redirect to login
        clearAuthTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint (use proxy path for client-side)
        const refreshUrl =
          typeof window !== "undefined"
            ? "/api/admin/auth/v1/refresh_token"
            : `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://batterydoctor.elvee.app/api"}/admin/auth/v1/refresh_token`;

        const response = await axios.post(
          refreshUrl,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              env: process.env.NEXT_PUBLIC_ENV || "test",
              "x-device": process.env.NEXT_PUBLIC_DEVICE || "web",
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.response;

        // Store new tokens
        setAuthTokens(accessToken, newRefreshToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        clearAuthTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================
// Token Management Utilities
// ============================================================

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  // Store tokens in cookies (accessible by middleware)
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    expires: 1, // 1 day
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearAuthTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(ADMIN_USER_KEY);
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setAdminUser = (user: object): void => {
  Cookies.set(ADMIN_USER_KEY, JSON.stringify(user), {
    expires: 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getAdminUser = (): object | null => {
  const user = Cookies.get(ADMIN_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export default apiClient;
