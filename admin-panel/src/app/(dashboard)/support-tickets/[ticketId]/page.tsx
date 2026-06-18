/**
 * Ticket Conversation Page
 *
 * Features:
 * - Chat-style conversation UI (admin messages right, user messages left)
 * - Send new message with optional internal note
 * - Status update from ticket detail view
 * - Attachment display
 * - Auto-scroll to latest message
 * - Real-time refresh
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileIcon,
  ImageIcon,
  Loader2,
  Paperclip,
  Send,
  AlertCircle,
  StickyNote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  useConversations,
  useSendMessage,
  useUpdateTicketStatus,
} from "@/hooks/use-support-tickets";
import { TicketStatus, TicketConversation } from "@/types";

// Status badge config (same as list page)
const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  inProgress: {
    label: "In Progress",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

// Format time for messages
function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Message Bubble Component
function MessageBubble({ msg }: { msg: TicketConversation }) {
  const isAdmin = msg.senderType === "admin";

  return (
    <div
      className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[75%] ${
          isAdmin
            ? "bg-green-500/10 border border-green-500/20 rounded-tl-xl rounded-bl-xl rounded-br-xl"
            : "bg-slate-700/50 border border-slate-600 rounded-tr-xl rounded-br-xl rounded-bl-xl"
        } px-4 py-3`}
      >
        {/* Sender Label */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-medium ${
              isAdmin ? "text-green-400" : "text-blue-400"
            }`}
          >
            {isAdmin ? "Admin" : "User"}
          </span>
          <span className="text-xs text-slate-500">
            {formatMessageTime(msg.createdAt)}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-sm text-slate-200 whitespace-pre-wrap">
          {msg.message}
        </p>

        {/* Internal Note (admin only) */}
        {msg.internalNote && (
          <div className="mt-2 flex items-start gap-1.5 bg-amber-500/5 border border-amber-500/20 rounded-md px-2.5 py-1.5">
            <StickyNote className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/80 italic">
              {msg.internalNote}
            </p>
          </div>
        )}

        {/* Attachments */}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {msg.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 bg-slate-800/50 rounded px-2 py-1.5 transition-colors"
              >
                {att.type === "image" ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <FileIcon className="h-3 w-3" />
                )}
                <span className="truncate">{att.fileName || att.key}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketConversationPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;

  const [message, setMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [showNoteField, setShowNoteField] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("open");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useConversations({
    ticketId,
    page: 1,
    limit: 50,
  });

  const sendMessage = useSendMessage(ticketId);
  const updateStatus = useUpdateTicketStatus();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (data?.items) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.items]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    sendMessage.mutate(
      {
        message: message.trim(),
        internalNote: internalNote.trim(),
        attachments: [],
      },
      {
        onSuccess: () => {
          setMessage("");
          setInternalNote("");
          setShowNoteField(false);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStatusUpdate = (newStatus: string | null) => {
    if (!newStatus) return;
    setTicketStatus(newStatus as TicketStatus);
    updateStatus.mutate({ ticketId, status: newStatus as TicketStatus });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/support-tickets")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">
              Ticket Conversation
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              ID: {ticketId.slice(0, 12)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-11 sm:ml-0">
          <span className="text-sm text-slate-400">Status:</span>
          <Select value={ticketStatus} onValueChange={handleStatusUpdate}>
            <SelectTrigger className="w-[140px] h-8 bg-slate-700/50 border-slate-600 text-slate-200">
              <SelectValue>
                <Badge className={statusConfig[ticketStatus]?.className || ""}>
                  {statusConfig[ticketStatus]?.label || ticketStatus}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
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
      </div>

      {/* Conversation Area */}
      <Card className="flex-1 flex flex-col bg-slate-800/50 border-slate-700 overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-700">
          <CardTitle className="text-sm text-slate-400 font-normal">
            {data ? `${data.total} message${data.total !== 1 ? "s" : ""}` : "Messages"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="ml-2 text-slate-400">Loading conversation...</span>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-red-400 text-sm">
                {error?.message || "Failed to load conversation"}
              </p>
            </div>
          )}

          {/* Messages */}
          {!isLoading && !isError && (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {data?.items.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <MessageSquareIcon className="h-10 w-10 mb-2" />
                    <p>No messages yet. Start the conversation below.</p>
                  </div>
                )}
                {data?.items.map((msg) => (
                  <MessageBubble key={msg._id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </CardContent>

        {/* Message Input */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/80">
          {/* Internal Note Toggle */}
          {showNoteField && (
            <div className="mb-3">
              <Label className="text-xs text-amber-400 mb-1 flex items-center gap-1">
                <StickyNote className="h-3 w-3" />
                Internal Note (visible only to admins)
              </Label>
              <Input
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add an internal note..."
                className="bg-slate-700/50 border-slate-600 text-slate-200 text-sm"
              />
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply... (Shift+Enter for new line)"
                className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-500 resize-none min-h-[44px] max-h-[120px]"
                rows={1}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNoteField(!showNoteField)}
                  className={`h-8 w-8 ${
                    showNoteField
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Toggle internal note"
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessage.isPending}
                  size="icon"
                  className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}

// Simple icon for empty state
function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
