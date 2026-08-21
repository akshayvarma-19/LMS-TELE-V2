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
    // Build initial query selecting public and coordinate/classification fields
    let query = supabase
      .from('land_records')
      .select('id, survey_number, land_extent_acres, village, taluk, district, land_classification, latitude, longitude', { count: 'exact' });

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

    // Retrieve anomalies for the matching records
    const landIds = data ? data.map(r => r.id) : [];
    let anomalies: any[] = [];
    if (landIds.length > 0) {
      const { data: anomaliesData, error: anomaliesError } = await supabase
        .from('land_anomalies')
        .select('id, land_id, anomaly_type, severity, risk_score, description, status')
        .in('land_id', landIds);

      if (!anomaliesError && anomaliesData) {
        anomalies = anomaliesData;
      }
    }

    // Map anomalies to their corresponding land record
    const anomalyMap = new Map<string, any[]>();
    anomalies.forEach(a => {
      const list = anomalyMap.get(a.land_id) || [];
      list.push({
        id: a.id,
        anomaly_type: a.anomaly_type,
        severity: a.severity,
        risk_score: a.risk_score,
        description: a.description,
        status: a.status
      });
      anomalyMap.set(a.land_id, list);
    });

    const records = (data || []).map(r => ({
      id: r.id,
      survey_number: r.survey_number,
      property_extent: r.land_extent_acres ? `${r.land_extent_acres} Acres` : 'N/A',
      village: r.village,
      taluk: r.taluk,
      district: r.district,
      land_type: r.land_classification,
      latitude: r.latitude,
      longitude: r.longitude,
      anomalies: anomalyMap.get(r.id) || []
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }
};
