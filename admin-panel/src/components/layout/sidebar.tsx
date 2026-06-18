/**
 * Dashboard Sidebar Navigation
 *
 * Features:
 * - Collapsible sidebar
 * - Active route highlighting
 * - Module icons and labels
 * - Mobile responsive with sheet overlay
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  HelpCircle,
  Car,
  CreditCard,
  HeadphonesIcon,
  Bell,
  Settings,
  Users,
  Handshake,
  Zap,
  LayoutDashboard,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "FAQs",
    href: "/faqs",
    icon: HelpCircle,
  },
  {
    title: "Vehicle Profiles",
    href: "/vehicle-profiles",
    icon: Car,
  },
  {
    title: "Subscription Plans",
    href: "/subscription-plans",
    icon: CreditCard,
  },
  {
    title: "Support Tickets",
    href: "/support-tickets",
    icon: HeadphonesIcon,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "App Contents",
    href: "/app-contents",
    icon: FileText,
  },
  {
    title: "App Settings",
    href: "/app-settings",
    icon: Settings,
  },
  {
    title: "Partner",
    href: "/partner",
    icon: Handshake,
  },
  {
    title: "Attachments",
    href: "/attachments",
    icon: Paperclip,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-slate-700 bg-slate-900",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <Zap className="h-4 w-4 text-green-500" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">Battery Doctor</h1>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <p className="text-xs text-slate-600 text-center">
          v1.0.0 — Battery Doctor
        </p>
      </div>
    </aside>
  );
}
