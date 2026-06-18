/**
 * Subscription Plans Management Page
 *
 * Features:
 * - List all subscription plans in a card grid
 * - Create new plan with all required fields
 * - Edit plan inline via dialog
 * - Shows price, duration, SKU codes, trial days
 */

"use client";

import { useState } from "react";
import {
  CreditCard,
  Loader2,
  Plus,
  Pencil,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { subscriptionPlansService } from "@/lib/api/subscription-plans.service";
import { SubscriptionPlan, CreateSubscriptionPlanRequest } from "@/types";

const defaultForm = {
  vehicleLicence: 1,
  planType: "pro",
  duration: "monthly",
  price: 0,
  trialDays: 3,
  androidSkuCode: "",
  iosSkuCode: "",
  status: "active",
};

export default function SubscriptionPlansPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const queryClient = useQueryClient();

  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => subscriptionPlansService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSubscriptionPlanRequest) => subscriptionPlansService.create(data),
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      setShowDialog(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSubscriptionPlanRequest> }) =>
      subscriptionPlansService.update(id, data),
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      setShowDialog(false);
      setEditingPlan(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      vehicleLicence: plan.vehicleLicence,
      planType: plan.planType,
      duration: plan.duration,
      price: plan.price,
      trialDays: plan.trialDays,
      androidSkuCode: plan.androidSkuCode,
      iosSkuCode: plan.iosSkuCode,
      status: plan.status,
    });
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan._id, data: formData });
    } else {
      createMutation.mutate(formData as CreateSubscriptionPlanRequest);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-green-400" />
            Subscription Plans
          </h1>
          <p className="text-slate-400 mt-1">Configure subscription tiers and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })} className="border-slate-600 text-slate-300">
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
          <Button size="sm" onClick={() => { setEditingPlan(null); setFormData(defaultForm); setShowDialog(true); }} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />Add Plan
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
          <span className="ml-2 text-slate-400">Loading plans...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-red-400">Failed to load subscription plans</p>
        </div>
      )}

      {!isLoading && !isError && plans && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan._id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base capitalize">{plan.planType} — {plan.duration}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(plan)} className="h-8 w-8 text-slate-400 hover:text-white">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-400">${plan.price}</span>
                  <span className="text-slate-500">/{plan.duration}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Vehicle Licences</span>
                    <span className="text-white">{plan.vehicleLicence}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Trial Days</span>
                    <span className="text-white">{plan.trialDays}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status</span>
                    <Badge className={plan.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-700 space-y-1">
                  <p className="text-xs text-slate-500">Android: <span className="text-slate-400 font-mono">{plan.androidSkuCode}</span></p>
                  <p className="text-xs text-slate-500">iOS: <span className="text-slate-400 font-mono">{plan.iosSkuCode}</span></p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) { setShowDialog(false); setEditingPlan(null); } }}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-200">Plan Type</Label>
                <Select value={formData.planType} onValueChange={(v) => setFormData({ ...formData, planType: v || "pro" })}>
                  <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="pro" className="text-slate-200">Pro</SelectItem>
                    <SelectItem value="basic" className="text-slate-200">Basic</SelectItem>
                    <SelectItem value="custom" className="text-slate-200">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-200">Duration</Label>
                <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v || "monthly" })}>
                  <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="monthly" className="text-slate-200">Monthly</SelectItem>
                    <SelectItem value="yearly" className="text-slate-200">Yearly</SelectItem>
                    <SelectItem value="custom" className="text-slate-200">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-200">Price ($)</Label>
                <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              </div>
              <div>
                <Label className="text-slate-200">Vehicle Licences</Label>
                <Input type="number" value={formData.vehicleLicence} onChange={(e) => setFormData({ ...formData, vehicleLicence: parseInt(e.target.value) || 1 })} className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              </div>
              <div>
                <Label className="text-slate-200">Trial Days</Label>
                <Input type="number" value={formData.trialDays} onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })} className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-slate-200">Android SKU Code</Label>
              <Input value={formData.androidSkuCode} onChange={(e) => setFormData({ ...formData, androidSkuCode: e.target.value })} placeholder="app.elvee.batterydr.pro..." className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div>
              <Label className="text-slate-200">iOS SKU Code</Label>
              <Input value={formData.iosSkuCode} onChange={(e) => setFormData({ ...formData, iosSkuCode: e.target.value })} placeholder="app.elvee.batterydr.pro..." className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div>
              <Label className="text-slate-200">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v || "active" })}>
                <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="active" className="text-slate-200">Active</SelectItem>
                  <SelectItem value="inactive" className="text-slate-200">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
