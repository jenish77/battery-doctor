/**
 * FAQs Management Page
 *
 * Features:
 * - List all FAQs with category and status filter
 * - Create new FAQ with multilingual question/answer
 * - Edit existing FAQ inline via dialog
 * - Delete FAQ with confirmation
 * - Toggle FAQ active/inactive status
 */

"use client";

import { useState } from "react";
import {
  HelpCircle,
  Loader2,
  Plus,
  Pencil,
  Trash2,
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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { faqsService } from "@/lib/api/faqs.service";
import { FAQ, CreateFAQRequest, UpdateFAQRequest } from "@/types";

export default function FAQsPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    order: 100,
    status: true,
  });

  const queryClient = useQueryClient();

  // Fetch FAQs
  const { data: faqs, isLoading, isError } = useQuery({
    queryKey: ["faqs", categoryFilter],
    queryFn: () =>
      faqsService.getAll(categoryFilter ? { category: categoryFilter } : undefined),
  });

  // Create FAQ
  const createMutation = useMutation({
    mutationFn: (data: CreateFAQRequest) => faqsService.create(data),
    onSuccess: () => {
      toast.success("FAQ created successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Update FAQ
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFAQRequest }) =>
      faqsService.update(id, data),
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setEditingFaq(null);
      resetForm();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Delete FAQ
  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqsService.delete(id),
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ question: "", answer: "", category: "general", order: 100, status: true });
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question.en,
      answer: faq.answer.en,
      category: faq.category,
      order: faq.order,
      status: faq.status,
    });
  };

  const handleSubmit = () => {
    if (editingFaq) {
      updateMutation.mutate({
        id: editingFaq._id,
        data: {
          question: { en: formData.question },
          answer: { en: formData.answer },
          category: formData.category,
        },
      });
    } else {
      createMutation.mutate({
        question: { en: formData.question },
        answer: { en: formData.answer },
        category: formData.category,
        order: formData.order,
        status: formData.status,
      });
    }
  };

  const handleDelete = (faq: FAQ) => {
    if (confirm(`Delete FAQ: "${faq.question.en}"?`)) {
      deleteMutation.mutate(faq._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-purple-400" />
            FAQs Management
          </h1>
          <p className="text-slate-400 mt-1">Create and manage frequently asked questions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["faqs"] })}
            className="border-slate-600 text-slate-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => { resetForm(); setShowCreateDialog(true); }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Category:</span>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || "")}>
              <SelectTrigger className="w-[180px] bg-slate-700/50 border-slate-600 text-slate-200">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="" className="text-slate-200">All Categories</SelectItem>
                <SelectItem value="general" className="text-slate-200">General</SelectItem>
                <SelectItem value="batteryScore" className="text-slate-200">Battery Score</SelectItem>
                <SelectItem value="subscription" className="text-slate-200">Subscription</SelectItem>
              </SelectContent>
            </Select>
            {faqs && <span className="text-sm text-slate-500">{faqs.length} FAQs</span>}
          </div>
        </CardContent>
      </Card>

      {/* FAQs Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">All FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="ml-2 text-slate-400">Loading FAQs...</span>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-red-400">Failed to load FAQs</p>
            </div>
          )}

          {!isLoading && !isError && faqs && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Question</TableHead>
                    <TableHead className="text-slate-400">Category</TableHead>
                    <TableHead className="text-slate-400">Order</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq._id} className="border-slate-700/50 hover:bg-slate-700/30">
                      <TableCell className="text-white max-w-[300px]">
                        <p className="truncate font-medium">{faq.question.en}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{faq.answer.en.slice(0, 80)}...</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {faq.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">{faq.order}</TableCell>
                      <TableCell>
                        <Badge className={faq.status ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                          {faq.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(faq)} className="h-8 w-8 text-slate-400 hover:text-white">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(faq)} className="h-8 w-8 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingFaq} onOpenChange={(open) => { if (!open) { setShowCreateDialog(false); setEditingFaq(null); } }}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingFaq ? "Edit FAQ" : "Create New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-200">Question (English)</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question..."
                className="mt-1 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-200">Answer (English)</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer (supports Markdown)..."
                className="mt-1 bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-200">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v || "general" })}>
                  <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="general" className="text-slate-200">General</SelectItem>
                    <SelectItem value="batteryScore" className="text-slate-200">Battery Score</SelectItem>
                    <SelectItem value="subscription" className="text-slate-200">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-200">Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!formData.question || !formData.answer || createMutation.isPending || updateMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingFaq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
