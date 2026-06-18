/**
 * Support Tickets List Page
 *
 * Features:
 * - Paginated table of all support tickets
 * - Filter by status (open, inProgress, resolved, closed)
 * - Quick status update via dropdown
 * - Click to view conversation
 * - Relative time display for last message
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeadphonesIcon,
  Loader2,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTickets, useUpdateTicketStatus, ticketKeys } from "@/hooks/use-support-tickets";
import { TicketStatus } from "@/types";
import { Pagination } from "@/components/shared/pagination";

// Status configuration for badges
const statusConfig: Record<
  TicketStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }
> = {
  open: {
    label: "Open",
    variant: "default",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  },
  inProgress: {
    label: "In Progress",
    variant: "default",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  resolved: {
    label: "Resolved",
    variant: "default",
    className: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
  },
  closed: {
    label: "Closed",
    variant: "default",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20",
  },
};

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function SupportTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useTickets({
    status: statusFilter || undefined,
    page: currentPage,
    limit: 10,
  });

  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateStatus.mutate({ ticketId, status: newStatus });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-yellow-400" />
            Support Tickets
          </h1>
          <p className="text-slate-400 mt-1">
            View and manage user support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Status:</span>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as TicketStatus | "")
                }
              >
                <SelectTrigger className="w-[160px] bg-slate-700/50 border-slate-600 text-slate-200">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="" className="text-slate-200">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="open" className="text-slate-200">
                    Open
                  </SelectItem>
                  <SelectItem value="inProgress" className="text-slate-200">
                    In Progress
                  </SelectItem>
                  <SelectItem value="resolved" className="text-slate-200">
                    Resolved
                  </SelectItem>
                  <SelectItem value="closed" className="text-slate-200">
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data && (
              <span className="text-sm text-slate-500">
                Showing {data.items.length} of {data.total} tickets
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="ml-2 text-slate-400">Loading tickets...</span>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-red-400 text-sm">
                Failed to load tickets: {error?.message || "Unknown error"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-slate-600 text-slate-300"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <HeadphonesIcon className="h-10 w-10 text-slate-600" />
              <p className="text-slate-500">No support tickets found</p>
              {statusFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter("")}
                  className="text-slate-400 hover:text-white"
                >
                  Clear filter
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && data && data.items.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Title</TableHead>
                    <TableHead className="text-slate-400">User ID</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">
                      Last Message
                    </TableHead>
                    <TableHead className="text-slate-400">Created</TableHead>
                    <TableHead className="text-slate-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((ticket) => {
                    const config = statusConfig[ticket.status as TicketStatus] || statusConfig.open;
                    return (
                      <TableRow
                        key={ticket._id}
                        className="border-slate-700/50 hover:bg-slate-700/30"
                      >
                        {/* Title */}
                        <TableCell className="font-medium text-white max-w-[200px] truncate">
                          {ticket.title}
                        </TableCell>

                        {/* User ID (truncated) */}
                        <TableCell className="text-slate-400 font-mono text-xs">
                          {ticket.userId.slice(0, 8)}...
                        </TableCell>

                        {/* Status Badge with Dropdown */}
                        <TableCell>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                ticket._id,
                                value as TicketStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[130px] h-7 border-0 bg-transparent p-0 focus:ring-0">
                              <Badge
                                variant={config.variant}
                                className={config.className}
                              >
                                {config.label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem
                                value="open"
                                className="text-slate-200"
                              >
                                Open
                              </SelectItem>
                              <SelectItem
                                value="inProgress"
                                className="text-slate-200"
                              >
                                In Progress
                              </SelectItem>
                              <SelectItem
                                value="resolved"
                                className="text-slate-200"
                              >
                                Resolved
                              </SelectItem>
                              <SelectItem
                                value="closed"
                                className="text-slate-200"
                              >
                                Closed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Last Message */}
                        <TableCell className="text-slate-400 text-sm">
                          {formatRelativeTime(ticket.lastMessageAt)}
                        </TableCell>

                        {/* Created */}
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Link
                            href={`/support-tickets/${ticket._id}`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              total={data.total}
              limit={data.limit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
