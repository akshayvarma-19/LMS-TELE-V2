import type { Grievance, GrievanceUpdate, ApiResponse } from '../types';
import { request } from './api';

export interface CreateGrievanceInput {
  land_id: string;
  category: Grievance['category'];
  description: string;
  supporting_document_url?: string;
  mismatched_fields?: string[];
}

export const grievanceService = {
  async getMyGrievances(): Promise<ApiResponse<Grievance[]>> {
    return request<ApiResponse<Grievance[]>>('/grievances/my-grievances');
  },

  async getGrievance(_id: string): Promise<ApiResponse<Grievance>> {
    return request<ApiResponse<Grievance>>(`/grievances/${_id}`);
  },

  async getGrievanceUpdates(_grievanceId: string): Promise<ApiResponse<GrievanceUpdate[]>> {
    return request<ApiResponse<GrievanceUpdate[]>>(`/grievances/${_grievanceId}/updates`);
  },

  async createGrievance(_input: CreateGrievanceInput): Promise<ApiResponse<Grievance>> {
    return request<ApiResponse<Grievance>>('/grievances');
  },

  async getAllGrievances(_filters?: { status?: string; category?: string }): Promise<ApiResponse<Grievance[]>> {
    return request<ApiResponse<Grievance[]>>('/officer/grievances');
  },

  async updateGrievanceStatus(
    _id: string,
    _status: Grievance['status'],
    _officerComment: string
  ): Promise<ApiResponse<Grievance>> {
    return request<ApiResponse<Grievance>>(`/officer/grievances/${_id}/status`);
  }
};
