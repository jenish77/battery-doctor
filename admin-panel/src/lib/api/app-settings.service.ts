/**
 * App Settings Service
 *
 * API Endpoints:
 * - GET /admin/app_settings/v1 — Get app settings
 * - PUT /admin/app_settings/v1 — Update app settings
 */

import { AppSettings } from "@/types";
import apiClient from "./client";

export const appSettingsService = {
  async get(): Promise<AppSettings> {
    const response = await apiClient.get<{ response: AppSettings }>(
      "/admin/app_settings/v1"
    );
    return response.data.response;
  },

  async update(data: Partial<AppSettings>): Promise<AppSettings> {
    const response = await apiClient.put<{ response: AppSettings }>(
      "/admin/app_settings/v1",
      data
    );
    return response.data.response;
  },
};
