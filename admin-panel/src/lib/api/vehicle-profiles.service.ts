/**
 * Vehicle Profiles Service
 *
 * API Endpoints:
 * - POST   /admin/vehicle_profiles/v1              — Create vehicle profile
 * - GET    /admin/vehicle_profiles/v1              — List vehicle profiles
 * - PATCH  /admin/vehicle_profiles/v1/{profileId}  — Update vehicle profile
 * - DELETE /admin/vehicle_profiles/v1/{profileId}  — Delete vehicle profile
 */

import { VehicleProfile } from "@/types";
import apiClient from "./client";

export const vehicleProfilesService = {
  async getAll(): Promise<VehicleProfile[]> {
    const response = await apiClient.get<{ response: VehicleProfile[] }>(
      "/admin/vehicle_profiles/v1"
    );
    return response.data.response;
  },

  async create(data: Partial<VehicleProfile>): Promise<VehicleProfile> {
    const response = await apiClient.post<{ response: VehicleProfile }>(
      "/admin/vehicle_profiles/v1",
      data
    );
    return response.data.response;
  },

  async update(
    profileId: string,
    data: Partial<VehicleProfile>
  ): Promise<VehicleProfile> {
    const response = await apiClient.patch<{ response: VehicleProfile }>(
      `/admin/vehicle_profiles/v1/${profileId}`,
      data
    );
    return response.data.response;
  },

  async delete(profileId: string): Promise<void> {
    await apiClient.delete(`/admin/vehicle_profiles/v1/${profileId}`);
  },
};
