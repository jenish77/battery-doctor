"use client";

import { useState } from "react";
import { Users, Loader2, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usersService } from "@/lib/api/users.service";

export default function UsersPage() {
  const [userId, setUserId] = useState("");
  const [entitlementIdentifier, setEntitlementIdentifier] = useState("pro");
  const [endTimeMs, setEndTimeMs] = useState("");

  const mutation = useMutation({
    mutationFn: () => usersService.assignSubscription(userId, {
      entitlementIdentifier,
      endTimeMs: parseInt(endTimeMs),
    }),
    onSuccess: () => {
      toast.success("Subscription assigned successfully");
      setUserId(""); setEndTimeMs("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !endTimeMs) { toast.error("All fields are required"); return; }
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="h-6 w-6 text-blue-400" />User Management</h1>
        <p className="text-slate-400 mt-1">Assign subscriptions to users</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 max-w-lg">
        <CardHeader><CardTitle className="text-white">Assign Subscription</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label className="text-slate-200">User ID</Label>
              <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user ID..." className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div><Label className="text-slate-200">Entitlement Identifier</Label>
              <Input value={entitlementIdentifier} onChange={(e) => setEntitlementIdentifier(e.target.value)} placeholder="pro" className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div><Label className="text-slate-200">End Time (ms timestamp)</Label>
              <Input type="number" value={endTimeMs} onChange={(e) => setEndTimeMs(e.target.value)} placeholder="1883000000000" className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              <p className="text-xs text-slate-500 mt-1">Unix timestamp in milliseconds for subscription end date</p>
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Assign Subscription
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
