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
    return request<ApiResponse<Grievance[]>>('/citizen/grievances');
  },

  async getGrievance(id: string): Promise<ApiResponse<Grievance>> {
    const sessionStr = localStorage.getItem('supabase_session');
    let role = 'citizen';
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        role = session.user?.user_metadata?.role || session.role || 'citizen';
      } catch (e) {}
    }
    const base = role === 'officer' ? '/officer/grievances' : '/citizen/grievances';
    return request<ApiResponse<Grievance>>(`${base}/${id}`);
  },

  async getGrievanceUpdates(grievanceId: string): Promise<ApiResponse<GrievanceUpdate[]>> {
    const sessionStr = localStorage.getItem('supabase_session');
    let role = 'citizen';
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        role = session.user?.user_metadata?.role || session.role || 'citizen';
      } catch (e) {}
    }
    const base = role === 'officer' ? '/officer/grievances' : '/citizen/grievances';
    const res = await request<ApiResponse<any>>(`${base}/${grievanceId}/tracking`);
    if (res.success || res.status === 'success') {
      const timeline = res.data?.timeline || [];
      const mappedTimeline: GrievanceUpdate[] = timeline.map((t: any) => ({
        id: t.id || '',
        grievance_id: grievanceId,
        old_status: t.old_status,
        new_status: t.status,
        comment: t.remarks,
        updated_by: t.updated_by,
        created_at: t.updated_at
      }));
      return {
        ...res,
        data: mappedTimeline
      };
    }
    return res;
  },

  async createGrievance(input: CreateGrievanceInput): Promise<ApiResponse<Grievance>> {
    return request<ApiResponse<Grievance>>('/citizen/grievances', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async getAllGrievances(filters?: { status?: string; category?: string }): Promise<ApiResponse<Grievance[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return request<ApiResponse<Grievance[]>>(`/officer/grievances${queryStr}`);
  },

  async updateGrievanceStatus(
    id: string,
    status: Grievance['status'],
    officerComment: string
  ): Promise<ApiResponse<Grievance>> {
    return request<ApiResponse<Grievance>>(`/officer/grievances/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, remark: officerComment })
    });
  }
};
