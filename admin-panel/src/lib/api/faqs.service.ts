/**
 * FAQs Service
 *
 * API Endpoints:
 * - POST   /admin/faqs/v1          — Create FAQ
 * - GET    /admin/faqs/v1          — List FAQs (filter by category, status)
 * - PATCH  /admin/faqs/v1/{faqId}  — Update FAQ
 * - DELETE /admin/faqs/v1/{faqId}  — Delete FAQ
 */

import { FAQ, CreateFAQRequest, UpdateFAQRequest } from "@/types";
import apiClient from "./client";

export interface GetFAQsParams {
  category?: string;
  status?: string;
}

export const faqsService = {
  async getAll(params?: GetFAQsParams): Promise<FAQ[]> {
    const response = await apiClient.get<{ response: FAQ[] }>(
      "/admin/faqs/v1",
      { params }
    );
    return response.data.response;
  },

  async create(data: CreateFAQRequest): Promise<FAQ> {
    const response = await apiClient.post<{ response: FAQ }>(
      "/admin/faqs/v1",
      data
    );
    return response.data.response;
  },

  async update(faqId: string, data: UpdateFAQRequest): Promise<FAQ> {
    const response = await apiClient.patch<{ response: FAQ }>(
      `/admin/faqs/v1/${faqId}`,
      data
    );
    return response.data.response;
  },

  async delete(faqId: string): Promise<void> {
    await apiClient.delete(`/admin/faqs/v1/${faqId}`);
  },
};
