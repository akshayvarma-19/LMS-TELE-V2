import { supabase } from '../lib/supabase.js';

export interface PublicSearchFilters {
  survey_number?: string;
  village?: string;
  taluk?: string;
  district?: string;
}

export const publicLandService = {
  /**
   * Search public land records using safe parameterized Supabase queries.
   * Selects ONLY the designated public columns.
   */
  async searchPublicLands(filters: PublicSearchFilters, page: number, limit: number) {
    // Build initial query selecting ONLY public fields
    let query = supabase
      .from('land_records')
      .select('survey_number, property_extent:land_extent_acres, village, taluk, district', { count: 'exact' });

    // Apply filters with AND conditions
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

    // Apply stable ordering
    query = query
      .order('district', { ascending: true })
      .order('taluk', { ascending: true })
      .order('village', { ascending: true })
      .order('survey_number', { ascending: true });

    // Calculate range for pagination (inclusive range)
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Retrieve records in range
    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(`Public land search failed: ${error.message}`);
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
  }
};
