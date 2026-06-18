"use client";

import { BarChart3, Loader2, RefreshCw, AlertCircle, TrendingUp, Users, HeadphonesIcon, CreditCard, Car } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supportTicketsService } from "@/lib/api/support-tickets.service";
import { subscriptionPlansService } from "@/lib/api/subscription-plans.service";
import { vehicleProfilesService } from "@/lib/api/vehicle-profiles.service";
import { faqsService } from "@/lib/api/faqs.service";
import { AnalyticsCharts } from "@/components/shared/analytics-charts";

export default function AnalyticsPage() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["analytics-tickets"],
    queryFn: () => supportTicketsService.getTickets({}),
  });

  const { data: openTickets } = useQuery({
    queryKey: ["analytics-tickets-open"],
    queryFn: () => supportTicketsService.getTickets({ status: "open" }),
  });

  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ["analytics-plans"],
    queryFn: () => subscriptionPlansService.getAll(),
  });

  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ["analytics-profiles"],
    queryFn: () => vehicleProfilesService.getAll(),
  });

  const { data: faqs, isLoading: loadingFaqs } = useQuery({
    queryKey: ["analytics-faqs"],
    queryFn: () => faqsService.getAll(),
  });

  const isLoading = loadingTickets || loadingPlans || loadingProfiles || loadingFaqs;

  const stats = [
    { label: "Total Tickets", value: tickets?.total || 0, icon: HeadphonesIcon, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Open Tickets", value: openTickets?.total || 0, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Subscription Plans", value: plans?.length || 0, icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Vehicle Profiles", value: profiles?.length || 0, icon: Car, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Total FAQs", value: faqs?.length || 0, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  // Prepare chart data
  const ticketStatusData = [
    { name: "Open", value: openTickets?.total || 0, fill: "#3b82f6" },
    { name: "In Progress", value: Math.max(0, (tickets?.total || 0) - (openTickets?.total || 0)), fill: "#eab308" },
  ];

  const plansPriceData = (plans || []).map((p) => ({
    name: `${p.planType} (${p.duration})`,
    price: p.price,
    vehicles: p.vehicleLicence,
  }));

  const faqCategoryData = (() => {
    const categories: Record<string, number> = {};
    (faqs || []).forEach((f) => {
      categories[f.category] = (categories[f.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value, fill: name === "general" ? "#10b981" : name === "batteryScore" ? "#6366f1" : "#f59e0b" }));
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-400" />Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Platform overview and metrics</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()} className="border-border">
          <RefreshCw className="h-4 w-4 mr-2" />Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <AnalyticsCharts
            ticketStatusData={ticketStatusData}
            plansPriceData={plansPriceData}
            faqCategoryData={faqCategoryData}
          />
        </>
      )}
    </div>
  );
}
