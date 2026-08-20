import { supabase } from '../lib/supabase.js';
import { notificationService } from './notificationService.js';

export interface OfficerGrievanceFilters {
  status?: string;
  category?: string;
  district?: string;
  taluk?: string;
  village?: string;
}

const STATUS_UI_TO_DB: Record<string, string> = {
  'submitted': 'Submitted',
  'under_review': 'Under Review',
  'info_required': 'Additional Information Required',
  'resolved': 'Resolved',
  'rejected': 'Rejected'
};

const STATUS_DB_TO_UI: Record<string, string> = {
  'Submitted': 'submitted',
  'Under Review': 'under_review',
  'Additional Information Required': 'info_required',
  'Resolved': 'resolved',
  'Rejected': 'rejected'
};

function mapGrievanceStatusDbToUi(g: any) {
  if (!g) return g;
  return {
    ...g,
    status: STATUS_DB_TO_UI[g.status] || g.status
  };
}

function mapUpdateStatusDbToUi(u: any) {
  if (!u) return u;
  return {
    ...u,
    old_status: u.old_status ? (STATUS_DB_TO_UI[u.old_status] || u.old_status) : null,
    new_status: u.new_status ? (STATUS_DB_TO_UI[u.new_status] || u.new_status) : u.new_status
  };
}

export const grievanceService = {
  /**
   * Verify if a land record belongs to a specific user.
   */
  async verifyLandOwnership(userId: string, landId: string): Promise<boolean> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(landId);
    let query = supabase
      .from('land_records')
      .select('id')
      .eq('owner_id', userId);

    if (isUuid) {
      query = query.eq('id', landId);
    } else {
      query = query.eq('land_id', landId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Ownership verification check failed: ${error.message}`);
    }

    return !!data;
  },

  /**
   * Create a new grievance.
   */
  async createGrievance(userId: string, landId: string, category: string, description: string) {
    // 1. Resolve UUID and verify ownership
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(landId);
    let query = supabase
      .from('land_records')
      .select('id')
      .eq('owner_id', userId);

    if (isUuid) {
      query = query.eq('id', landId);
    } else {
      query = query.eq('land_id', landId);
    }

    const { data: landRecord, error: verifyError } = await query.maybeSingle();

    if (verifyError) {
      throw new Error(`Ownership verification check failed: ${verifyError.message}`);
    }

    if (!landRecord) {
      throw new Error('Verification failed. Land record does not belong to the user or does not exist.');
    }

    const resolvedLandUuid = landRecord.id;

    // 2. Generate a unique grievance number
    const grievanceNumber = `GRV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const dbStatus = STATUS_UI_TO_DB['submitted'];

    // 3. Insert grievance record using resolved UUID
    const { data: grievance, error: insertError } = await supabase
      .from('grievances')
      .insert([
        {
          grievance_number: grievanceNumber,
          land_id: resolvedLandUuid,
          submitted_by: userId,
          category,
          description,
          status: dbStatus
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create grievance: ${insertError.message}`);
    }

    // 4. Create initial grievance update record to start the timeline
    const { error: updateError } = await supabase
      .from('grievance_updates')
      .insert([
        {
          grievance_id: grievance.id,
          old_status: null,
          new_status: dbStatus,
          comment: 'Grievance submitted by citizen.',
          updated_by: userId
        }
      ]);

    if (updateError) {
      console.error('Warning: Failed to create initial timeline update:', updateError.message);
    }

    // Trigger notification for successful grievance submission
    try {
      await notificationService.createNotification(
        userId,
        'grievance',
        'Grievance Submitted',
        `Your grievance petition ${grievanceNumber} has been successfully submitted and is under review.`,
        'grievances',
        grievance.id
      );
    } catch (e: any) {
      console.error('Warning: Failed to create grievance submission notification:', e.message);
    }

    return mapGrievanceStatusDbToUi(grievance);
  },

  /**
   * Get grievances for the authenticated citizen.
   */
  async getCitizenGrievances(userId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Filter grievances by checking the inner land_records owner_id
    const { data, error, count } = await supabase
      .from('grievances')
      .select('*, land_records!inner(*)', { count: 'exact' })
      .eq('land_records.owner_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to retrieve citizen grievances: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      records: (data || []).map(mapGrievanceStatusDbToUi),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  /**
   * Get a single grievance details for a citizen, checking ownership.
   */
  async getCitizenGrievanceById(userId: string, id: string) {
    const { data, error } = await supabase
      .from('grievances')
      .select('*, land_records!inner(*)')
      .eq('id', id)
      .eq('land_records.owner_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve grievance: ${error.message}`);
    }

    return mapGrievanceStatusDbToUi(data);
  },

  /**
   * Get the timeline/updates for a grievance.
   */
  async getGrievanceUpdates(userId: string, grievanceId: string, userRole: 'citizen' | 'officer') {
    // 1. Verify access permission:
    // If citizen, verify they own the associated land record.
    if (userRole === 'citizen') {
      const grievance = await this.getCitizenGrievanceById(userId, grievanceId);
      if (!grievance) {
        throw new Error('Access denied. Grievance not found.');
      }
    } else {
      // If officer, verify the grievance exists
      const { data: grievanceExists, error: checkError } = await supabase
        .from('grievances')
        .select('id')
        .eq('id', grievanceId)
        .maybeSingle();

      if (checkError || !grievanceExists) {
        throw new Error('Grievance not found.');
      }
    }

    // 2. Fetch updates sorted by created_at ascending
    const { data, error } = await supabase
      .from('grievance_updates')
      .select('*')
      .eq('grievance_id', grievanceId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to retrieve grievance timeline: ${error.message}`);
    }

    return (data || []).map(mapUpdateStatusDbToUi);
  },

  /**
   * List all grievances for an officer with filters and pagination.
   */
  async listOfficerGrievances(filters: OfficerGrievanceFilters, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build select query joining land_records
    let query = supabase
      .from('grievances')
      .select('*, land_records!inner(*)', { count: 'exact' });

    // Apply status and category filters if specified
    if (filters.status && filters.status.trim()) {
      const dbStatus = STATUS_UI_TO_DB[filters.status.trim()] || filters.status.trim();
      query = query.eq('status', dbStatus);
    }
    if (filters.category && filters.category.trim()) {
      query = query.eq('category', filters.category.trim());
    }

    // Apply location filters nested inside land_records
    if (filters.district && filters.district.trim()) {
      query = query.ilike('land_records.district', `%${filters.district.trim()}%`);
    }
    if (filters.taluk && filters.taluk.trim()) {
      query = query.ilike('land_records.taluk', `%${filters.taluk.trim()}%`);
    }
    if (filters.village && filters.village.trim()) {
      query = query.ilike('land_records.village', `%${filters.village.trim()}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to retrieve officer grievances: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      records: (data || []).map(mapGrievanceStatusDbToUi),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  /**
   * Get a single grievance details for an officer.
   */
  async getOfficerGrievanceById(id: string) {
    const { data, error } = await supabase
      .from('grievances')
      .select('*, land_records(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve grievance details: ${error.message}`);
    }

    return mapGrievanceStatusDbToUi(data);
  },

  /**
   * Update grievance status and append remarks to timeline.
   */
  async updateGrievanceStatus(officerId: string, id: string, newStatus: string, remark: string) {
    // 1. Fetch current status of the grievance
    const { data: currentGrievance, error: fetchError } = await supabase
      .from('grievances')
      .select('status')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !currentGrievance) {
      throw new Error('Grievance not found.');
    }

    const oldStatus = currentGrievance.status;
    const dbNewStatus = STATUS_UI_TO_DB[newStatus] || newStatus;

    // 2. Update status and officer comment in the grievances table
    const { data: updatedGrievance, error: updateGrievanceError } = await supabase
      .from('grievances')
      .update({
        status: dbNewStatus,
        officer_comment: remark,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (updateGrievanceError) {
      throw new Error(`Failed to update status: ${updateGrievanceError.message}`);
    }

    // 3. Append history update row to the grievance_updates table (timeline)
    const { error: insertUpdateError } = await supabase
      .from('grievance_updates')
      .insert([
        {
          grievance_id: id,
          old_status: oldStatus,
          new_status: dbNewStatus,
          comment: remark,
          updated_by: officerId
        }
      ]);

    if (insertUpdateError) {
      console.error('Warning: Failed to log status change in timeline:', insertUpdateError.message);
    }

    // Trigger notification for grievance update to the citizen who filed it
    try {
      const citizenId = updatedGrievance.submitted_by;
      const statusUi = newStatus.replace(/_/g, ' ');
      await notificationService.createNotification(
        citizenId,
        'grievance',
        'Grievance Status Updated',
        `Your grievance petition ${updatedGrievance.grievance_number} has been marked as '${statusUi}' by the officer. Remark: "${remark}"`,
        'grievances',
        id
      );
    } catch (e: any) {
      console.error('Warning: Failed to create grievance status update notification:', e.message);
    }

    return mapGrievanceStatusDbToUi(updatedGrievance);
  }
};
