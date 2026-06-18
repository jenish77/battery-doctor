/**
 * Subscription Plans Service
 *
 * API Endpoints:
 * - POST   /admin/subscription_plans/v1           — Create plan
 * - GET    /admin/subscription_plans/v1           — List plans
 * - GET    /admin/subscription_plans/v1/{planId}  — Plan detail
 * - PATCH  /admin/subscription_plans/v1/{planId}  — Update plan
 */

import { SubscriptionPlan, CreateSubscriptionPlanRequest, UpdateSubscriptionPlanRequest } from "@/types";
import apiClient from "./client";

export const subscriptionPlansService = {
  async getAll(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<{ response: SubscriptionPlan[] }>(
      "/admin/subscription_plans/v1"
    );
    return response.data.response;
  },

  async getById(planId: string): Promise<SubscriptionPlan> {
    const response = await apiClient.get<{ response: SubscriptionPlan }>(
      `/admin/subscription_plans/v1/${planId}`
    );
    return response.data.response;
  },

  async create(data: CreateSubscriptionPlanRequest): Promise<SubscriptionPlan> {
    const response = await apiClient.post<{ response: SubscriptionPlan }>(
      "/admin/subscription_plans/v1",
      data
    );
    return response.data.response;
  },

  async update(
    planId: string,
    data: UpdateSubscriptionPlanRequest
  ): Promise<SubscriptionPlan> {
    const response = await apiClient.patch<{ response: SubscriptionPlan }>(
      `/admin/subscription_plans/v1/${planId}`,
      data
    );
    return response.data.response;
  },
};
