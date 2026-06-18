/**
 * Notifications Service
 *
 * API Endpoints:
 * - POST /admin/notifications/v1/send — Send push notification
 */

import { SendNotificationRequest } from "@/types";
import apiClient from "./client";

export const notificationsService = {
  async send(data: SendNotificationRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/admin/notifications/v1/send",
      data
    );
    return response.data;
  },
};
