/**
 * App Contents Service
 *
 * API Endpoints:
 * - GET   /admin/app_contents/v1 — Get app contents
 * - PATCH /admin/app_contents/v1 — Update app contents
 */

import { AppContent } from "@/types";
import apiClient from "./client";

export const appContentsService = {
  async get(): Promise<AppContent> {
    const response = await apiClient.get<{ response: AppContent }>(
      "/admin/app_contents/v1"
    );
    return response.data.response;
  },

  async update(data: Partial<AppContent>): Promise<AppContent> {
    const response = await apiClient.patch<{ response: AppContent }>(
      "/admin/app_contents/v1",
      data
    );
    return response.data.response;
  },
};
