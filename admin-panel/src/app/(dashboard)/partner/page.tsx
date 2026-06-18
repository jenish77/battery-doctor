"use client";

import { useState } from "react";
import { Handshake, Loader2, Key, AlertTriangle, RefreshCw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { partnerService } from "@/lib/api/partner.service";


export default function PartnerPage() {
  const [region, setRegion] = useState("eu");
  const [domain, setDomain] = useState("");
  const queryClient = useQueryClient();

  const publicKeyQuery = useQuery({
    queryKey: ["partner-public-key", domain, region],
    queryFn: () => partnerService.getPublicKey({ domain, region }),
    enabled: false,
  });

  const errorsQuery = useQuery({
    queryKey: ["fleet-errors", region],
    queryFn: () => partnerService.getFleetTelemetryErrors({ region }),
    enabled: false,
  });

  const errorVinsQuery = useQuery({
    queryKey: ["fleet-error-vins", region],
    queryFn: () => partnerService.getFleetTelemetryErrorVins({ region }),
    enabled: false,
  });

  const registerMutation = useMutation({
    mutationFn: () => partnerService.register({ region, domain }),
    onSuccess: (data) => { toast.success("Partner registered"); console.log("Register response:", data); },
    onError: (e: Error) => toast.error(e.message),
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Handshake className="h-6 w-6 text-indigo-400" />Partner Management</h1>
        <p className="text-slate-400 mt-1">Manage Tesla Fleet API partner registration and telemetry</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Register Partner */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white text-base">Register Partner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-slate-200">Region</Label>
              <Select value={region} onValueChange={(v) => setRegion(v || "eu")}>
                <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="eu" className="text-slate-200">EU</SelectItem>
                  <SelectItem value="na" className="text-slate-200">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-slate-200">Domain</Label>
              <Input value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1 bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <Button onClick={() => registerMutation.mutate()} disabled={registerMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Register Partner
            </Button>
          </CardContent>
        </Card>

        {/* Public Key */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white text-base flex items-center gap-2"><Key className="h-4 w-4" />Public Key</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => publicKeyQuery.refetch()} disabled={publicKeyQuery.isFetching} variant="outline" className="w-full border-slate-600 text-slate-300">
              {publicKeyQuery.isFetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}Fetch Public Key
            </Button>
            {publicKeyQuery.data && (
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Public Key:</p>
                <p className="text-xs font-mono text-green-400 break-all">{publicKeyQuery.data.response.public_key}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Fleet Telemetry Errors */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-400" />Fleet Telemetry Errors</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => errorsQuery.refetch()} disabled={errorsQuery.isFetching} className="border-slate-600 text-slate-300">
                {errorsQuery.isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : "Load Errors"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => errorVinsQuery.refetch()} disabled={errorVinsQuery.isFetching} className="border-slate-600 text-slate-300">
                {errorVinsQuery.isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : "Load VINs"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errorsQuery.data && (
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Errors: {errorsQuery.data.response.fleet_telemetry_errors.length}</p>
              {errorsQuery.data.response.fleet_telemetry_errors.length === 0 && <p className="text-slate-500 text-sm">No errors found.</p>}
            </div>
          )}
          {errorVinsQuery.data && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Error VINs: {errorVinsQuery.data.response.fleet_telemetry_error_vins.length}</p>
              {errorVinsQuery.data.response.fleet_telemetry_error_vins.length === 0 && <p className="text-slate-500 text-sm">No error VINs found.</p>}
              {errorVinsQuery.data.response.fleet_telemetry_error_vins.map((vin, i) => (
                <p key={i} className="text-xs font-mono text-slate-300">{vin}</p>
              ))}
            </div>
          )}
          {!errorsQuery.data && !errorVinsQuery.data && <p className="text-slate-500 text-sm">Click buttons above to load telemetry data.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
