import type { LandRecord, PublicLandRecord, LandSearchFilter, LandTransfer, ApiResponse } from '../types';
import { request } from './api';

export const landService = {
  async getMyLandRecords(): Promise<ApiResponse<LandRecord[]>> {
    return request<ApiResponse<LandRecord[]>>('/land-records/my-lands');
  },

  async getLandRecord(_id: string): Promise<ApiResponse<LandRecord>> {
    return request<ApiResponse<LandRecord>>(`/land-records/${_id}`);
  },

  async searchLandRecords(_filters: LandSearchFilter): Promise<ApiResponse<PublicLandRecord[]>> {
    return request<ApiResponse<PublicLandRecord[]>>('/land-records/search');
  },

  async getAllLandRecords(_filters?: LandSearchFilter): Promise<ApiResponse<LandRecord[]>> {
    return request<ApiResponse<LandRecord[]>>('/officer/land-records');
  },

  async createLandRecord(_data: Omit<LandRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<LandRecord>> {
    return request<ApiResponse<LandRecord>>('/officer/land-records');
  },

  async updateLandRecord(_id: string, _data: Partial<LandRecord>): Promise<ApiResponse<LandRecord>> {
    return request<ApiResponse<LandRecord>>(`/officer/land-records/${_id}`);
  },

  async getLandTransfers(_landId: string): Promise<ApiResponse<LandTransfer[]>> {
    return request<ApiResponse<LandTransfer[]>>(`/land-records/${_landId}/transfers`);
  }
};
