/**
 * useAuth Hook
 *
 * Provides authentication state and actions throughout the app.
 * Uses React Context to share auth state across all components.
 */

"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/auth-provider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
