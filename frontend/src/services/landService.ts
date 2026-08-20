import type { LandRecord, PublicLandRecord, LandSearchFilter, LandTransfer, ApiResponse } from '../types';
import { request } from './api';

function flattenLandRecord(item: any): LandRecord {
  if (!item) return item;
  // If it's already flat, return it directly
  if (item.survey_number !== undefined) return item;
  
  return {
    id: item.id || item.system_information?.id || '',
    land_id: item.land_id || item.system_information?.land_id || '',
    owner_id: item.owner_id || item.ownership?.owner_id || '',
    document_type: item.registration?.document_type || '',
    document_number: item.registration?.document_number || '',
    registration_date: item.registration?.registration_date || '',
    registration_office: item.registration?.registration_office || '',
    district: item.location?.district || '',
    taluk: item.location?.taluk || '',
    village: item.location?.village || '',
    survey_number: item.basic_information?.survey_number || '',
    patta_number: item.basic_information?.patta_number || '',
    property_extent: item.basic_information?.property_extent || '',
    land_type: item.basic_information?.land_type || '',
    owner_name: item.ownership?.owner_name || '',
    previous_owner: item.ownership?.previous_owner || '',
    sale_consideration: item.transaction_information?.sale_consideration || '',
    property_description: item.description?.property_description || '',
    parent_document: item.transaction_information?.parent_document || '',
    created_at: item.created_at || item.system_information?.created_at || '',
    updated_at: item.updated_at || item.system_information?.updated_at || ''
  };
}

export const landService = {
  async getMyLandRecords(): Promise<ApiResponse<LandRecord[]>> {
    const res = await request<ApiResponse<any[]>>('/citizen/lands');
    if (res.data && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(flattenLandRecord)
      };
    }
    return res;
  },

  async getLandRecord(id: string): Promise<ApiResponse<LandRecord>> {
    const sessionStr = localStorage.getItem('supabase_session');
    let role = 'citizen';
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        role = session.user?.user_metadata?.role || session.role || 'citizen';
      } catch (e) {}
    }
    const base = role === 'officer' ? '/officer/lands' : '/citizen/lands';
    const res = await request<ApiResponse<any>>(`${base}/${id}`);
    if (res.data) {
      return {
        ...res,
        data: flattenLandRecord(res.data)
      };
    }
    return res;
  },

  async searchLandRecords(filters: LandSearchFilter): Promise<ApiResponse<PublicLandRecord[]>> {
    const params = new URLSearchParams();
    if (filters.survey_number) params.append('survey_number', filters.survey_number);
    if (filters.village) params.append('village', filters.village);
    if (filters.taluk) params.append('taluk', filters.taluk);
    if (filters.district) params.append('district', filters.district);
    return request<ApiResponse<PublicLandRecord[]>>(`/lands/search?${params.toString()}`);
  },

  async getAllLandRecords(_filters?: LandSearchFilter): Promise<ApiResponse<LandRecord[]>> {
    const res = await request<ApiResponse<any[]>>('/officer/lands');
    if (res.data && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(flattenLandRecord)
      };
    }
    return res;
  },

  async createLandRecord(data: Omit<LandRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<LandRecord>> {
    const res = await request<ApiResponse<any>>('/officer/lands', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.data) {
      return {
        ...res,
        data: flattenLandRecord(res.data)
      };
    }
    return res;
  },

  async updateLandRecord(id: string, data: Partial<LandRecord>): Promise<ApiResponse<LandRecord>> {
    const res = await request<ApiResponse<any>>(`/officer/lands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (res.data) {
      return {
        ...res,
        data: flattenLandRecord(res.data)
      };
    }
    return res;
  },

  async getLandTransfers(_landId: string): Promise<ApiResponse<LandTransfer[]>> {
    return { status: 'success', data: [] };
  }
};
