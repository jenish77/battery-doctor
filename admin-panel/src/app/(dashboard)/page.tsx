/**
 * Dashboard Overview Page
 *
 * Landing page after login showing summary cards for all modules.
 * Provides quick access to all admin features.
 */

"use client";

import {
  BarChart3,
  Bell,
  Car,
  CreditCard,
  FileText,
  Handshake,
  HeadphonesIcon,
  HelpCircle,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const modules = [
  {
    title: "Users",
    description: "Manage users and assign subscriptions",
    icon: Users,
    href: "/users",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "FAQs",
    description: "Create and manage frequently asked questions",
    icon: HelpCircle,
    href: "/faqs",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Vehicle Profiles",
    description: "Manage vehicle battery profiles",
    icon: Car,
    href: "/vehicle-profiles",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    title: "Subscription Plans",
    description: "Configure subscription tiers and pricing",
    icon: CreditCard,
    href: "/subscription-plans",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    title: "Support Tickets",
    description: "View and respond to user support requests",
    icon: HeadphonesIcon,
    href: "/support-tickets",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    title: "Notifications",
    description: "Send push notifications to users",
    icon: Bell,
    href: "/notifications",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    title: "App Contents",
    description: "Manage in-app content and descriptions",
    icon: FileText,
    href: "/app-contents",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    title: "App Settings",
    description: "Configure application settings",
    icon: Settings,
    href: "/app-settings",
    color: "text-slate-300",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
  },
  {
    title: "Partner",
    description: "Manage partners and fleet telemetry",
    icon: Handshake,
    href: "/partner",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    title: "Analytics",
    description: "View platform usage and metrics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s an overview of your Battery Doctor admin panel
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Modules</p>
                <p className="text-2xl font-bold text-white">11</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">API Endpoints</p>
                <p className="text-2xl font-bold text-white">30</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-2xl font-bold text-green-400">Active</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card
                className={`bg-slate-800/50 border-slate-700 hover:${module.borderColor} hover:bg-slate-800 transition-all cursor-pointer group h-full`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${module.bgColor}`}
                    >
                      <module.icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                    <CardTitle className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                      {module.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-400">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
