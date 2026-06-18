"use client";

import { useState, useEffect } from "react";
import { Settings, Loader2, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { appSettingsService } from "@/lib/api/app-settings.service";


export default function AppSettingsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["app-settings"],
    queryFn: () => appSettingsService.get(),
  });

  useEffect(() => {
    if (data) {
      setFormData({
        supportEmail: data.supportEmail || "",
        playStoreLink: data.playStoreLink || "",
        appStoreLink: data.appStoreLink || "",
        termsUrl: data.termsUrl || "",
        privacyUrl: data.privacyUrl || "",
        instagram: data.instagram || "",
        linkedIn: data.linkedIn || "",
        facebook: data.facebook || "",
        twitter: data.twitter || "",
        reddit: data.reddit || "",
      });
      setUnderMaintenance(data.underMaintenance || false);
    }
  }, [data]);


  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => appSettingsService.update(payload),
    onSuccess: () => { toast.success("Settings updated"); queryClient.invalidateQueries({ queryKey: ["app-settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = () => {
    updateMutation.mutate({
      ...formData,
      underMaintenance,
      allowedFileType: data?.allowedFileType || [],
      ios: data?.ios || {},
      android: data?.android || {},
    });
  };

  const updateField = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const fields = [
    { key: "supportEmail", label: "Support Email" },
    { key: "playStoreLink", label: "Play Store Link" },
    { key: "appStoreLink", label: "App Store Link" },
    { key: "termsUrl", label: "Terms URL" },
    { key: "privacyUrl", label: "Privacy URL" },
    { key: "instagram", label: "Instagram" },
    { key: "linkedIn", label: "LinkedIn" },
    { key: "facebook", label: "Facebook" },
    { key: "twitter", label: "Twitter/X" },
    { key: "reddit", label: "Reddit" },
  ];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings className="h-6 w-6 text-slate-300" />App Settings</h1>
          <p className="text-slate-400 mt-1">Configure application settings and links</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["app-settings"] })} className="border-slate-600 text-slate-300"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save
          </Button>
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-green-500" /></div>}
      {isError && <div className="flex items-center justify-center py-12"><AlertCircle className="h-8 w-8 text-red-400" /></div>}

      {!isLoading && !isError && (
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2"><CardTitle className="text-white text-base">Maintenance Mode</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <button onClick={() => setUnderMaintenance(!underMaintenance)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${underMaintenance ? "bg-red-500" : "bg-slate-600"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${underMaintenance ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <Badge className={underMaintenance ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}>{underMaintenance ? "Under Maintenance" : "Live"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2"><CardTitle className="text-white text-base">Links & Contact</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(({ key, label }) => (
                  <div key={key}><Label className="text-slate-300 text-sm">{label}</Label>
                    <Input value={formData[key] || ""} onChange={(e) => updateField(key, e.target.value)} className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
