import { supabaseAdmin } from '../lib/supabase.js';

export interface LandSearchFilters {
  survey_number?: string;
  village?: string;
  taluk?: string;
  district?: string;
  patta_number?: string;
  land_id?: string;
}

export const citizenLandService = {
  /**
   * Fetch only land records belonging to the authenticated owner.
   */
  async getMyLands(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('land_records')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      throw new Error(`Failed to fetch land records: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch a single land record belonging to the authenticated citizen.
   */
  async getLandById(userId: string, id: string) {
    const { data, error } = await supabaseAdmin
      .from('land_records')
      .select('*')
      .eq('id', id)
      .eq('owner_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch land record: ${error.message}`);
    }

    return data;
  },

  /**
   * General search across all land records in the database.
   */
  async searchLands(userId: string, filters: LandSearchFilters) {
    let query = supabaseAdmin
      .from('land_records')
      .select('*');

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
    if (filters.land_id && filters.land_id.trim()) {
      query = query.eq('land_id', filters.land_id.trim());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Calculate summary from the owner's own land records.
   */
  async getLandSummary(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('land_records')
      .select('property_extent:land_extent_acres, village, taluk, district')
      .eq('owner_id', userId);

    if (error) {
      throw new Error(`Failed to calculate summary: ${error.message}`);
    }

    const records = data || [];
    const totalLandRecords = records.length;

    // Build unique list of locations
    const locationSet = new Set<string>();
    records.forEach(r => {
      const locParts = [r.village, r.taluk, r.district].filter(part => part && part.trim());
      if (locParts.length > 0) {
        locationSet.add(locParts.join(', '));
      }
    });

    // Try to reliably sum property_extent
    let totalExtent = 0;
    let reliableSum = true;

    for (const r of records) {
      const extentStr = r.property_extent ? String(r.property_extent).trim() : '';
      if (!extentStr) continue;

      // If it contains non-numeric characters (excluding decimal point),
      // we check if it has unit suffixes like 'sq.ft', 'sqft', 'acres', etc.
      // If we find mixed units or non-trivial formats, we mark as unreliable.
      const cleaned = extentStr.replace(/,/g, '');
      const numOnly = cleaned.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(numOnly);

      if (isNaN(parsed)) {
        reliableSum = false;
        break;
      }

      // Check if it has any characters that might indicate units (e.g. sq.ft vs acres)
      const hasAlphabetic = /[a-zA-Z]/.test(cleaned);
      if (hasAlphabetic) {
        // If it's a mix of units, it's unsafe to aggregate
        reliableSum = false;
        break;
      }

      totalExtent += parsed;
    }

    return {
      totalLandRecords,
      totalExtent: reliableSum ? totalExtent : 0,
      locations: Array.from(locationSet)
    };
  }
};
