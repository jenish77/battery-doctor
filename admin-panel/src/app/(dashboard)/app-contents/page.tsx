"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { appContentsService } from "@/lib/api/app-contents.service";
import { AppContent } from "@/types";

const CONTENT_FIELDS = [
  { key: "batteryHealthScore", label: "Battery Health Score" },
  { key: "degradation", label: "Degradation" },
  { key: "phantomDrain", label: "Phantom Drain" },
  { key: "usableBatteryCapacity", label: "Usable Battery Capacity" },
  { key: "lifetimeEnergyUsed", label: "Lifetime Energy Used" },
  { key: "projectedSoh", label: "Projected SOH" },
  { key: "warrantyCoverage", label: "Warranty Coverage" },
  { key: "alerts", label: "Alerts" },
  { key: "recommendation", label: "Recommendation" },
  { key: "stressFactor", label: "Stress Factor" },
  { key: "prioritydo", label: "Priority Do" },
  { key: "rangeCalculator", label: "Range Calculator" },
  { key: "chargingInfo", label: "Charging Info" },
  { key: "vehicleInformation", label: "Vehicle Information" },
];

export default function AppContentsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["app-contents"],
    queryFn: () => appContentsService.get(),
  });

  useEffect(() => {
    if (data) {
      const fields: Record<string, string> = {};
      CONTENT_FIELDS.forEach(({ key }) => {
        const val = data[key as keyof AppContent];
        fields[key] = (val && typeof val === "object" && "en" in val) ? val.en : "";
      });
      setFormData(fields);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<AppContent>) => appContentsService.update(payload),
    onSuccess: () => { toast.success("App contents updated"); queryClient.invalidateQueries({ queryKey: ["app-contents"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = () => {
    const payload: Record<string, { en: string }> = {};
    CONTENT_FIELDS.forEach(({ key }) => { if (formData[key]) payload[key] = { en: formData[key] }; });
    updateMutation.mutate(payload as Partial<AppContent>);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="h-6 w-6 text-cyan-400" />App Contents</h1>
          <p className="text-slate-400 mt-1">Manage in-app content descriptions (supports Markdown)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["app-contents"] })} className="border-slate-600 text-slate-300"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save All
          </Button>
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-green-500" /></div>}
      {isError && <div className="flex items-center justify-center py-12"><AlertCircle className="h-8 w-8 text-red-400" /></div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {CONTENT_FIELDS.map(({ key, label }) => (
            <Card key={key} className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2"><CardTitle className="text-white text-sm">{label}</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  value={formData[key] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white text-sm min-h-[100px]"
                  placeholder={`Enter ${label} content...`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
