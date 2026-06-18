/**
 * Users Service
 *
 * API Endpoints:
 * - POST /admin/users/v1/{userId}/assign_subscription — Assign subscription to user
 */

import { AssignSubscriptionRequest } from "@/types";
import apiClient from "./client";

export const usersService = {
  async assignSubscription(
    userId: string,
    data: AssignSubscriptionRequest
  ): Promise<void> {
    await apiClient.post(
      `/admin/users/v1/${userId}/assign_subscription`,
      data
    );
  },
};
