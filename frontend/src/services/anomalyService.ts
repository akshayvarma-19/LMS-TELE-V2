import type { LandAnomaly, ApiResponse } from '../types';
import { request } from './api';

export const anomalyService = {
  async getCitizenAnomalies(): Promise<ApiResponse<LandAnomaly[]>> {
    return request<ApiResponse<LandAnomaly[]>>('/anomalies/my-alerts');
  },

  async getOfficerAnomalies(_filters?: { severity?: string; status?: string }): Promise<ApiResponse<LandAnomaly[]>> {
    return request<ApiResponse<LandAnomaly[]>>('/officer/anomalies');
  },

  async updateAnomalyStatus(_id: string, _status: LandAnomaly['status']): Promise<ApiResponse<LandAnomaly>> {
    return request<ApiResponse<LandAnomaly>>(`/officer/anomalies/${_id}/status`);
  }
};
