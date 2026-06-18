"use client";

import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notificationsService } from "@/lib/api/notifications.service";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");

  const mutation = useMutation({
    mutationFn: () => notificationsService.send({
      notification: { title, body },
      topic: topic || undefined,
    }),
    onSuccess: () => {
      toast.success("Notification sent successfully!");
      setTitle(""); setBody(""); setTopic("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) { toast.error("Title and body are required"); return; }
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bell className="h-6 w-6 text-red-400" />Push Notifications</h1>
        <p className="text-slate-400 mt-1">Send push notifications to users</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 max-w-lg">
        <CardHeader><CardTitle className="text-white">Send Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label className="text-slate-200">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title..." className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div><Label className="text-slate-200">Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notification message..." className="mt-1 bg-slate-700/50 border-slate-600 text-white min-h-[100px]" />
            </div>
            <div><Label className="text-slate-200">Topic / User ID (optional)</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="User ID or topic for targeted notification..." className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              <p className="text-xs text-slate-500 mt-1">Leave empty to send to all users</p>
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send Notification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
