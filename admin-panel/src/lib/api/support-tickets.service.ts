/**
 * Support Tickets Service
 *
 * Handles all support ticket API calls:
 * - GET    /admin/support_tickets/v1                           — List tickets (with optional status/userId filter)
 * - PATCH  /admin/support_tickets/v1/{ticketId}               — Update ticket status
 * - GET    /admin/support_tickets/v1/{ticketId}/conversations — Get ticket conversations
 * - POST   /admin/support_tickets/v1/{ticketId}/conversations — Send a reply / add conversation
 */

import {
  ConversationListResponse,
  CreateConversationRequest,
  SupportTicketDetail,
  TicketConversation,
  TicketListResponse,
  TicketStatus,
  UpdateTicketRequest,
} from "@/types";
import apiClient from "./client";

export interface GetTicketsParams {
  status?: TicketStatus | "";
  userId?: string;
  page?: number;
  limit?: number;
}

export interface GetConversationsParams {
  ticketId: string;
  page?: number;
  limit?: number;
}

export const supportTicketsService = {
  /**
   * List support tickets with optional filters
   */
  async getTickets(params?: GetTicketsParams): Promise<TicketListResponse> {
    const queryParams: Record<string, string | number> = {};

    if (params?.status) queryParams.status = params.status;
    if (params?.userId) queryParams.userId = params.userId;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await apiClient.get<{ response: TicketListResponse }>(
      "/admin/support_tickets/v1",
      { params: queryParams }
    );

    return response.data.response;
  },

  /**
   * Update ticket status (open, inProgress, resolved, closed)
   */
  async updateTicketStatus(
    ticketId: string,
    data: UpdateTicketRequest
  ): Promise<SupportTicketDetail> {
    const response = await apiClient.patch<{ response: SupportTicketDetail }>(
      `/admin/support_tickets/v1/${ticketId}`,
      data
    );

    return response.data.response;
  },

  /**
   * Get paginated conversations for a ticket
   */
  async getConversations(
    params: GetConversationsParams
  ): Promise<ConversationListResponse> {
    const { ticketId, page = 1, limit = 20 } = params;

    const response = await apiClient.get<{
      response: ConversationListResponse;
    }>(`/admin/support_tickets/v1/${ticketId}/conversations`, {
      params: { page, limit },
    });

    return response.data.response;
  },

  /**
   * Send a reply to a ticket conversation
   */
  async sendMessage(
    ticketId: string,
    data: CreateConversationRequest
  ): Promise<TicketConversation> {
    const response = await apiClient.post<{ response: TicketConversation }>(
      `/admin/support_tickets/v1/${ticketId}/conversations`,
      data
    );

    return response.data.response;
  },
};
