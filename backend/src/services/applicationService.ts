import { supabase } from '../lib/supabase.js';
import { notificationService } from './notificationService.js';

export interface ApplicationFilters {
  status?: string;
  type?: string;
}

// Memory fallback store for environments without public.applications table
let memoryApplications: any[] = [
  {
    id: 'app-991',
    citizen_id: 'test-citizen-id',
    applicant_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    land_id: 'LAND-001',
    survey_number: '124/3A',
    patta_number: 'PATTA-9081',
    village: 'Sathuvachari',
    taluk: 'Vellore',
    district: 'Vellore',
    property_extent: '2.5 Acres',
    type: 'land_use_change',
    details: 'Applying for conversion of 2.5 acres of agricultural classification land to commercial land for warehouse development.',
    document_name: 'deed_sathuvachari_124_3a.pdf',
    status: 'under_review',
    officer_remarks: 'Site inspection pending by local revenue officer.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-992',
    citizen_id: 'test-citizen-id',
    applicant_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    land_id: 'LAND-002',
    survey_number: '89/2B',
    patta_number: 'PATTA-5541',
    village: 'Katpadi',
    taluk: 'Katpadi',
    district: 'Vellore',
    property_extent: '1.2 Acres',
    type: 'sale_transfer',
    details: 'Sale transfer of Katpadi plot index 89/2B to buyer Anand Selvam. Deed executed on 18-08-2026.',
    document_name: 'sale_deed_anand_89_2b.pdf',
    status: 'approved',
    officer_remarks: 'Deed comparison matched database parameters. Mutation executed.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const STATUS_UI_TO_DB: Record<string, string> = {
  'submitted': 'Submitted',
  'under_review': 'Under Review',
  'info_required': 'Information Requested',
  'approved': 'Approved',
  'rejected': 'Rejected'
};

const STATUS_DB_TO_UI: Record<string, string> = {
  'Submitted': 'submitted',
  'Under Review': 'under_review',
  'Information Requested': 'info_required',
  'Approved': 'approved',
  'Rejected': 'rejected'
};

function mapStatusDbToUi(status: string): string {
  return STATUS_DB_TO_UI[status] || status;
}

function mapStatusUiToDb(status: string): string {
  return STATUS_UI_TO_DB[status] || status;
}

export const applicationService = {
  /**
   * Helper to execute queries with fallback.
   */
  async runWithFallback<T>(dbQuery: () => Promise<T>, fallbackQuery: () => Promise<T>): Promise<T> {
    try {
      return await dbQuery();
    } catch (err: any) {
      if (err.message && (err.message.includes('schema cache') || err.message.includes('relation "applications" does not exist') || err.code === 'PGRST205')) {
        console.warn('Supabase applications table not found. Using in-memory fallback.');
        return await fallbackQuery();
      }
      throw err;
    }
  },

  /**
   * Create a new application.
   */
  async createApplication(userId: string, landId: string, type: string, details: string, documentName: string) {
    const dbQuery = async () => {
      // Get applicant details
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
      const applicantName = user?.name || 'Citizen';
      const email = user?.email || '';
      const phone = user?.phone || '';

      // Get land details
      const { data: land } = await supabase.from('land_records').select('*').eq('id', landId).maybeSingle();

      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            citizen_id: userId,
            applicant_name: applicantName,
            email,
            phone,
            land_id: landId,
            survey_number: land?.survey_number || '',
            patta_number: land?.patta_number || '',
            village: land?.village || '',
            taluk: land?.taluk || '',
            district: land?.district || '',
            property_extent: land?.land_extent_acres ? `${land.land_extent_acres} Acres` : '',
            type,
            details,
            document_name: documentName,
            status: 'Submitted'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { ...data, status: mapStatusDbToUi(data.status) };
    };

    const fallbackQuery = async () => {
      // Find user and land records from DB to populate fallback
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
      const { data: land } = await supabase.from('land_records').select('*').eq('id', landId).maybeSingle();

      const newApp = {
        id: `app-${Date.now()}`,
        citizen_id: userId,
        applicant_name: user?.name || 'Citizen Applicant',
        email: user?.email || '',
        phone: user?.phone || '',
        land_id: landId,
        survey_number: land?.survey_number || 'N/A',
        patta_number: land?.patta_number || 'N/A',
        village: land?.village || 'N/A',
        taluk: land?.taluk || 'N/A',
        district: land?.district || 'N/A',
        property_extent: land?.land_extent_acres ? `${land.land_extent_acres} Acres` : 'N/A',
        type,
        details,
        document_name: documentName,
        status: 'submitted',
        officer_remarks: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      memoryApplications.unshift(newApp);
      return newApp;
    };

    return this.runWithFallback(dbQuery, fallbackQuery);
  },

  /**
   * Get applications for the authenticated citizen.
   */
  async getCitizenApplications(userId: string) {
    const dbQuery = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('citizen_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(app => ({ ...app, status: mapStatusDbToUi(app.status) }));
    };

    const fallbackQuery = async () => {
      return memoryApplications.filter(app => app.citizen_id === userId);
    };

    return this.runWithFallback(dbQuery, fallbackQuery);
  },

  /**
   * List all applications for an officer with optional filters.
   */
  async getOfficerApplications(filters: ApplicationFilters) {
    const dbQuery = async () => {
      let query = supabase.from('applications').select('*');

      if (filters.status) {
        query = query.eq('status', mapStatusUiToDb(filters.status));
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });
      if (error) throw error;

      return (data || []).map(app => ({ ...app, status: mapStatusDbToUi(app.status) }));
    };

    const fallbackQuery = async () => {
      let list = [...memoryApplications];
      if (filters.status) {
        list = list.filter(app => app.status === filters.status);
      }
      if (filters.type) {
        list = list.filter(app => app.type === filters.type);
      }
      return list;
    };

    return this.runWithFallback(dbQuery, fallbackQuery);
  },

  /**
   * Get a single application by ID.
   */
  async getApplicationById(id: string) {
    const dbQuery = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return { ...data, status: mapStatusDbToUi(data.status) };
    };

    const fallbackQuery = async () => {
      const found = memoryApplications.find(app => app.id === id);
      return found || null;
    };

    return this.runWithFallback(dbQuery, fallbackQuery);
  },

  /**
   * Adjudicate/update application status.
   */
  async adjudicateApplication(officerId: string, id: string, action: 'approve' | 'request_info' | 'reject', remarks: string) {
    const statusMap: Record<string, string> = {
      approve: 'Approved',
      request_info: 'Information Requested',
      reject: 'Rejected'
    };

    const newStatus = statusMap[action];

    const dbQuery = async () => {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          officer_remarks: remarks,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Trigger notification for citizen
      try {
        const typeLabels: Record<string, string> = {
          'sale_transfer': 'Land Sale / Transfer',
          'construction_approval': 'Construction Approval',
          'land_use_change': 'Land Use Change',
          'other_approval': 'Petitions / Approval'
        };
        const label = typeLabels[data.type] || 'Application';
        await notificationService.createNotification(
          data.citizen_id,
          'land_record',
          'Application Adjudicated',
          `Your application for ${label} has been marked as '${newStatus}'. Remarks: "${remarks}"`,
          'land_record',
          data.land_id
        );
      } catch (e: any) {
        console.error('Warning: Failed to create application notification:', e.message);
      }

      return { ...data, status: mapStatusDbToUi(data.status) };
    };

    const fallbackQuery = async () => {
      const index = memoryApplications.findIndex(app => app.id === id);
      if (index === -1) {
        throw new Error('Application not found.');
      }

      const updated = {
        ...memoryApplications[index],
        status: action === 'approve' ? 'approved' : action === 'request_info' ? 'info_required' : 'rejected',
        officer_remarks: remarks,
        updated_at: new Date().toISOString()
      };

      memoryApplications[index] = updated;

      // Trigger notification for citizen
      try {
        const typeLabels: Record<string, string> = {
          'sale_transfer': 'Land Sale / Transfer',
          'construction_approval': 'Construction Approval',
          'land_use_change': 'Land Use Change',
          'other_approval': 'Petitions / Approval'
        };
        const label = typeLabels[updated.type] || 'Application';
        await notificationService.createNotification(
          updated.citizen_id,
          'land_record',
          'Application Adjudicated',
          `Your application for ${label} has been marked as '${updated.status.replace('_', ' ')}'. Remarks: "${remarks}"`,
          'land_record',
          updated.land_id
        );
      } catch (e: any) {
        console.error('Warning: Failed to create application notification:', e.message);
      }

      return updated;
    };

    return this.runWithFallback(dbQuery, fallbackQuery);
  }
};
