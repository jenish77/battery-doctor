/**
 * Support Tickets Custom Hooks
 *
 * React Query hooks for managing support tickets state:
 * - useTickets: Fetch and filter ticket list
 * - useUpdateTicketStatus: Mutation to change ticket status
 * - useConversations: Fetch paginated conversations for a ticket
 * - useSendMessage: Mutation to reply to a ticket
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  supportTicketsService,
  GetTicketsParams,
  GetConversationsParams,
} from "@/lib/api/support-tickets.service";
import {
  CreateConversationRequest,
  TicketStatus,
  UpdateTicketRequest,
} from "@/types";

// ============================================================
// Query Keys
// ============================================================

export const ticketKeys = {
  all: ["support-tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (params?: GetTicketsParams) =>
    [...ticketKeys.lists(), params] as const,
  conversations: (ticketId: string, page?: number) =>
    [...ticketKeys.all, "conversations", ticketId, page] as const,
};

// ============================================================
// useTickets - Fetch ticket list with filters
// ============================================================

export function useTickets(params?: GetTicketsParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => supportTicketsService.getTickets(params),
    placeholderData: (prev) => prev,
  });
}

// ============================================================
// useUpdateTicketStatus - Change ticket status
// ============================================================

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: TicketStatus;
    }) => {
      const data: UpdateTicketRequest = { status };
      return supportTicketsService.updateTicketStatus(ticketId, data);
    },
    onSuccess: (data) => {
      toast.success(`Ticket status updated to "${data.status}"`);
      // Invalidate ticket lists to refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update ticket: ${error.message}`);
    },
  });
}

// ============================================================
// useConversations - Fetch paginated conversations
// ============================================================

export function useConversations(params: GetConversationsParams) {
  return useQuery({
    queryKey: ticketKeys.conversations(params.ticketId, params.page),
    queryFn: () => supportTicketsService.getConversations(params),
    enabled: !!params.ticketId,
    placeholderData: (prev) => prev,
  });
}

// ============================================================
// useSendMessage - Reply to a ticket
// ============================================================

export function useSendMessage(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) =>
      supportTicketsService.sendMessage(ticketId, data),
    onSuccess: () => {
      toast.success("Message sent successfully");
      // Invalidate conversations to show new message
      queryClient.invalidateQueries({
        queryKey: ticketKeys.conversations(ticketId),
      });
      // Also invalidate tickets list to update lastMessageAt
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}
