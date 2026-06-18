"use client";

import { useState } from "react";
import { Car, Loader2, Plus, Pencil, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { vehicleProfilesService } from "@/lib/api/vehicle-profiles.service";
import { VehicleProfile } from "@/types";

export default function VehicleProfilesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingProfile, setEditingProfile] = useState<VehicleProfile | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles, isLoading, isError } = useQuery({
    queryKey: ["vehicle-profiles"],
    queryFn: () => vehicleProfilesService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<VehicleProfile>) => vehicleProfilesService.create(data),
    onSuccess: () => { toast.success("Profile created"); queryClient.invalidateQueries({ queryKey: ["vehicle-profiles"] }); setShowDialog(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VehicleProfile> }) => vehicleProfilesService.update(id, data),
    onSuccess: () => { toast.success("Profile updated"); queryClient.invalidateQueries({ queryKey: ["vehicle-profiles"] }); setShowDialog(false); setEditingProfile(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleProfilesService.delete(id),
    onSuccess: () => { toast.success("Profile deleted"); queryClient.invalidateQueries({ queryKey: ["vehicle-profiles"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditingProfile(null);
    setJsonInput(JSON.stringify({ optionCodes: [], startYear: 2025, endYear: 2025, trimBadge: [], modelType: "3", marketingName: "", sources: [], range: { coldWeather: { cityKm: 0, highwayKm: 0, combinedKm: 0 }, mildWeather: { cityKm: 0, highwayKm: 0, combinedKm: 0 } }, battery: {}, charging: {}, performance: {}, energyConsumption: {}, homeChargingOptions: {}, fastCharging10To80: {} }, null, 2));
    setJsonError(""); setShowDialog(true);
  };

  const openEdit = (p: VehicleProfile) => {
    setEditingProfile(p);
    const { _id, createdAt, updatedAt, ...rest } = p;
    setJsonInput(JSON.stringify(rest, null, 2));
    setJsonError(""); setShowDialog(true);
  };

  const handleSubmit = () => {
    try { const parsed = JSON.parse(jsonInput); setJsonError("");
      editingProfile ? updateMutation.mutate({ id: editingProfile._id, data: parsed }) : createMutation.mutate(parsed);
    } catch { setJsonError("Invalid JSON"); }
  };

  const handleDelete = (p: VehicleProfile) => { if (confirm(`Delete "${p.marketingName}"?`)) deleteMutation.mutate(p._id); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Car className="h-6 w-6 text-orange-400" />Vehicle Profiles</h1>
          <p className="text-slate-400 mt-1">Manage vehicle battery profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["vehicle-profiles"] })} className="border-slate-600 text-slate-300"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4 mr-2" />Add Profile</Button>
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-green-500" /><span className="ml-2 text-slate-400">Loading...</span></div>}
      {isError && <div className="flex flex-col items-center justify-center py-12 gap-3"><AlertCircle className="h-8 w-8 text-red-400" /><p className="text-red-400">Failed to load profiles</p></div>}

      {!isLoading && !isError && profiles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <Card key={profile._id} className="bg-slate-800/50 border-slate-700 hover:border-orange-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-white text-sm leading-tight">{profile.marketingName}</CardTitle>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(profile)} className="h-7 w-7 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(profile)} className="h-7 w-7 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-400">Model {profile.modelType}</Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{profile.startYear}–{profile.endYear}</Badge>
                </div>
                {profile.range?.mildWeather && <p className="text-xs text-slate-500">Range: {profile.range.mildWeather.combinedKm} km (mild)</p>}
                {profile.optionCodes.length > 0 && <p className="text-xs text-slate-500">Options: {profile.optionCodes.join(", ")}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) { setShowDialog(false); setEditingProfile(null); } }}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-white">{editingProfile ? "Edit" : "Create"} Vehicle Profile</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-slate-200">Profile Data (JSON)</Label>
              <Textarea value={jsonInput} onChange={(e) => { setJsonInput(e.target.value); setJsonError(""); }} className="mt-1 bg-slate-700/50 border-slate-600 text-white font-mono text-xs min-h-[400px]" />
              {jsonError && <p className="text-red-400 text-sm mt-1">{jsonError}</p>}
            </div>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProfile ? "Update" : "Create"} Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
