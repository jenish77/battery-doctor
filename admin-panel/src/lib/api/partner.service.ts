/**
 * Partner Service
 *
 * API Endpoints:
 * - POST /admin/partner/v1/register                  — Register partner
 * - GET  /admin/partner/v1/public_key                — Get public key
 * - GET  /admin/partner/v1/fleet_telemetry_errors    — Get fleet telemetry errors
 * - GET  /admin/partner/v1/fleet_telemetry_error_vins — Get fleet telemetry error VINs
 */

import { PartnerRegisterRequest } from "@/types";
import apiClient from "./client";

export interface PartnerRegisterResponse {
  response: {
    account_id: string;
    domain: string;
    name: string;
    description: string;
    client_id: string;
    created_at: string;
    updated_at: string;
    enterprise_tier: string;
  };
}

export interface PublicKeyResponse {
  response: {
    public_key: string;
  };
}

export interface FleetTelemetryErrorsResponse {
  response: {
    fleet_telemetry_errors: Array<{
      vin: string;
      error: string;
      created_at: string;
    }>;
  };
}

export interface FleetTelemetryErrorVinsResponse {
  response: {
    fleet_telemetry_error_vins: string[];
  };
}

export const partnerService = {
  async register(
    data: PartnerRegisterRequest
  ): Promise<PartnerRegisterResponse> {
    const response = await apiClient.post<{ response: PartnerRegisterResponse }>(
      "/admin/partner/v1/register",
      data
    );
    return response.data.response;
  },

  async getPublicKey(params: {
    domain: string;
    region: string;
  }): Promise<PublicKeyResponse> {
    const response = await apiClient.get<{ response: PublicKeyResponse }>(
      "/admin/partner/v1/public_key",
      { params }
    );
    return response.data.response;
  },

  async getFleetTelemetryErrors(params: {
    region: string;
  }): Promise<FleetTelemetryErrorsResponse> {
    const response = await apiClient.get<{
      response: FleetTelemetryErrorsResponse;
    }>("/admin/partner/v1/fleet_telemetry_errors", { params });
    return response.data.response;
  },

  async getFleetTelemetryErrorVins(params: {
    region: string;
  }): Promise<FleetTelemetryErrorVinsResponse> {
    const response = await apiClient.get<{
      response: FleetTelemetryErrorVinsResponse;
    }>("/admin/partner/v1/fleet_telemetry_error_vins", { params });
    return response.data.response;
  },
};
