import { supabase } from '../lib/supabase.js';

export interface MapFilters {
  survey_number?: string;
  village?: string;
  taluk?: string;
  district?: string;
}

export const mapService = {
  /**
   * Retrieves map and land details for a specific record.
   */
  async getLandMapData(landId: string, userId: string, userRole: string): Promise<any> {
    const { data: land, error } = await supabase
      .from('land_records')
      .select('*')
      .eq('id', landId)
      .maybeSingle();

    if (error || !land) {
      return null;
    }

    // Verify citizen ownership
    if (userRole !== 'officer' && land.owner_id !== userId) {
      throw new Error('Access denied. You do not own this land record.');
    }

    // Build structured output
    const isOfficer = userRole === 'officer';

    const landInfo = {
      land_id: land.id,
      survey_number: land.survey_number,
      property_extent: land.land_extent_acres,
      village: land.village,
      taluk: land.taluk,
      district: land.district,
      land_type: land.land_classification,
      ...(isOfficer ? {
        owner_name: land.owner_name,
        document_number: land.document_number,
        registration_date: land.registration_date,
        registration_office: land.registration_office
      } : {})
    };

    return {
      land: landInfo,
      map: {
        map_available: false,
        geometry_available: false,
        geometry: null,
        provider: null
      }
    };
  },

  /**
   * Search/List lands for map visualization (Officer only).
   */
  async listLandsForMap(filters: MapFilters): Promise<any[]> {
    let query = supabase
      .from('land_records')
      .select('id, survey_number, property_extent:land_extent_acres, village, taluk, district, land_type:land_classification');

    if (filters.survey_number && filters.survey_number.trim() !== '') {
      query = query.ilike('survey_number', `%${filters.survey_number.trim()}%`);
    }
    if (filters.village && filters.village.trim() !== '') {
      query = query.ilike('village', `%${filters.village.trim()}%`);
    }
    if (filters.taluk && filters.taluk.trim() !== '') {
      query = query.ilike('taluk', `%${filters.taluk.trim()}%`);
    }
    if (filters.district && filters.district.trim() !== '') {
      query = query.ilike('district', `%${filters.district.trim()}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to query land records for map: ${error.message}`);
    }

    return (data || []).map(land => ({
      land_id: land.id,
      survey_number: land.survey_number,
      property_extent: land.property_extent,
      village: land.village,
      taluk: land.taluk,
      district: land.district,
      land_type: land.land_type
    }));
  }
};
