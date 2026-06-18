/**
 * Attachments Service
 *
 * API Endpoints:
 * - POST /admin/attachments/v1 — Upload document (multipart/form-data)
 */

import apiClient from "./client";

export interface AttachmentResponse {
  key: string;
  fileName: string;
  itemType: string;
  url: string;
}

export const attachmentsService = {
  async upload(file: File): Promise<AttachmentResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{ response: AttachmentResponse }>(
      "/admin/attachments/v1",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.response;
  },
};
