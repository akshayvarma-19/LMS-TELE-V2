import { supabase } from '../lib/supabase.js';

export interface OfficerGrievanceFilters {
  status?: string;
  category?: string;
  district?: string;
  taluk?: string;
  village?: string;
}

export const grievanceService = {
  /**
   * Verify if a land record belongs to a specific user.
   */
  async verifyLandOwnership(userId: string, landId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('land_records')
      .select('id')
      .eq('id', landId)
      .eq('owner_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Ownership verification check failed: ${error.message}`);
    }

    return !!data;
  },

  /**
   * Create a new grievance.
   */
  async createGrievance(userId: string, landId: string, category: string, description: string) {
    // 1. Verify that the land record belongs to the citizen
    const isOwner = await this.verifyLandOwnership(userId, landId);
    if (!isOwner) {
      throw new Error('Verification failed. Land record does not belong to the user or does not exist.');
    }

    // 2. Generate a unique grievance number
    const grievanceNumber = `GRV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Insert grievance record
    const { data: grievance, error: insertError } = await supabase
      .from('grievances')
      .insert([
        {
          grievance_number: grievanceNumber,
          land_id: landId,
          category,
          description,
          status: 'submitted'
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
          new_status: 'submitted',
          comment: 'Grievance submitted by citizen.',
          updated_by: userId
        }
      ]);

    if (updateError) {
      console.error('Warning: Failed to create initial timeline update:', updateError.message);
    }

    return grievance;
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
      records: data || [],
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

    return data;
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

    return data || [];
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
      query = query.eq('status', filters.status.trim());
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
      records: data || [],
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

    return data;
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

    // 2. Update status and officer comment in the grievances table
    const { data: updatedGrievance, error: updateGrievanceError } = await supabase
      .from('grievances')
      .update({
        status: newStatus,
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
          new_status: newStatus,
          comment: remark,
          updated_by: officerId
        }
      ]);

    if (insertUpdateError) {
      console.error('Warning: Failed to log status change in timeline:', insertUpdateError.message);
    }

    return updatedGrievance;
  }
};
