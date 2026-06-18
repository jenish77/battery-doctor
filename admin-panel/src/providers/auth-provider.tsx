/**
 * Authentication Provider
 *
 * Manages global auth state including:
 * - Current admin user
 * - Login/Logout actions
 * - Loading states
 * - Auto-restore session from cookies
 */

"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminUser } from "@/types";
import { authService } from "@/lib/api/auth.service";
import { ACCESS_TOKEN_KEY, ADMIN_USER_KEY } from "@/lib/api/client";

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from cookies on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const token = Cookies.get(ACCESS_TOKEN_KEY);
        const storedUser = Cookies.get(ADMIN_USER_KEY);

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login(email, password);
      setUser(response.admin);
      router.push("/");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
