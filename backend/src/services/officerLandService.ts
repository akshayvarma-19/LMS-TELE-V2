import { supabase } from '../lib/supabase.js';

export interface OfficerSearchFilters {
  survey_number?: string;
  village?: string;
  taluk?: string;
  district?: string;
  patta_number?: string;
  document_number?: string;
  owner_name?: string;
  land_type?: string;
}

export const officerLandService = {
  /**
   * List all land records with filters and pagination.
   */
  async listLands(filters: OfficerSearchFilters, page: number, limit: number) {
    let query = supabase
      .from('land_records')
      .select('*', { count: 'exact' });

    // Apply optional filters (AND conditions, trimmed input, case-insensitive match)
    if (filters.survey_number && filters.survey_number.trim()) {
      query = query.ilike('survey_number', `%${filters.survey_number.trim()}%`);
    }
    if (filters.village && filters.village.trim()) {
      query = query.ilike('village', `%${filters.village.trim()}%`);
    }
    if (filters.taluk && filters.taluk.trim()) {
      query = query.ilike('taluk', `%${filters.taluk.trim()}%`);
    }
    if (filters.district && filters.district.trim()) {
      query = query.ilike('district', `%${filters.district.trim()}%`);
    }
    if (filters.patta_number && filters.patta_number.trim()) {
      query = query.ilike('patta_number', `%${filters.patta_number.trim()}%`);
    }
    if (filters.document_number && filters.document_number.trim()) {
      query = query.ilike('document_number', `%${filters.document_number.trim()}%`);
    }
    if (filters.owner_name && filters.owner_name.trim()) {
      query = query.ilike('owner_name', `%${filters.owner_name.trim()}%`);
    }
    if (filters.land_type && filters.land_type.trim()) {
      query = query.ilike('land_type', `%${filters.land_type.trim()}%`);
    }

    // Apply stable ordering
    query = query
      .order('district', { ascending: true })
      .order('taluk', { ascending: true })
      .order('village', { ascending: true })
      .order('survey_number', { ascending: true });

    // Calculate ranges
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(`Failed to list land records: ${error.message}`);
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
   * Retrieve a single land record by ID.
   */
  async getLandById(id: string) {
    const { data, error } = await supabase
      .from('land_records')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve land record: ${error.message}`);
    }

    return data;
  },

  /**
   * Check if a user with the given ID exists in the database.
   */
  async checkUserExists(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check user existence: ${error.message}`);
    }

    return !!data;
  },

  /**
   * Create a new land record.
   */
  async createLandRecord(data: any) {
    // Check if the owner user exists
    if (data.owner_id) {
      const userExists = await this.checkUserExists(data.owner_id);
      if (!userExists) {
        throw new Error(`Owner ID '${data.owner_id}' does not correspond to an existing user.`);
      }
    }

    const { data: insertedData, error } = await supabase
      .from('land_records')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create land record: ${error.message}`);
    }

    return insertedData;
  },

  /**
   * Update an existing land record.
   */
  async updateLandRecord(id: string, data: any) {
    // Check if the new owner user exists
    if (data.owner_id) {
      const userExists = await this.checkUserExists(data.owner_id);
      if (!userExists) {
        throw new Error(`Owner ID '${data.owner_id}' does not correspond to an existing user.`);
      }
    }

    const updatePayload = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: updatedData, error } = await supabase
      .from('land_records')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update land record: ${error.message}`);
    }

    return updatedData;
  },

  /**
   * Get officer statistics/summary.
   */
  async getLandSummary() {
    // Retrieve columns needed to calculate district, village, taluk uniqueness
    const { data, error } = await supabase
      .from('land_records')
      .select('district, village, taluk');

    if (error) {
      throw new Error(`Failed to calculate summary: ${error.message}`);
    }

    const records = data || [];
    const totalLandRecords = records.length;

    const districts = new Set<string>();
    const villages = new Set<string>();
    const taluks = new Set<string>();

    records.forEach(r => {
      if (r.district && r.district.trim()) districts.add(r.district.trim());
      if (r.village && r.village.trim()) villages.add(r.village.trim());
      if (r.taluk && r.taluk.trim()) taluks.add(r.taluk.trim());
    });

    return {
      totalLandRecords,
      districts: Array.from(districts),
      villages: Array.from(villages),
      taluks: Array.from(taluks)
    };
  }
};
