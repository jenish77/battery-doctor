/**
 * Dashboard Layout
 *
 * Main layout for all authenticated dashboard pages.
 * Includes:
 * - Sidebar navigation (collapsible on mobile)
 * - Header with user actions
 * - Main content area
 * - Mobile-responsive sheet overlay for sidebar
 */

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading } = useAuth();

  // Show loading state while restoring session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 border-slate-700">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
