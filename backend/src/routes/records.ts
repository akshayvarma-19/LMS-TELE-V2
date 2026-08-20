import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/**
 * POST /api/records/search
 * Search public land records by survey_number, village, taluk, and district.
 * ONLY exposes non-sensitive public fields:
 * - survey_number
 * - property_extent
 * - village
 * - taluk
 * - district
 */
router.post('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { survey_number, village, taluk, district } = req.body;

    if (!survey_number || typeof survey_number !== 'string' || !survey_number.trim()) {
      res.status(400).json({
        status: 'error',
        message: 'Survey Number is required for searching public land records.'
      });
      return;
    }

    // Build database query selecting ONLY public non-sensitive columns
    let query = supabase
      .from('land_records')
      .select('survey_number, property_extent:land_extent_acres, village, taluk, district')
      .ilike('survey_number', `%${survey_number.trim()}%`);

    if (village && typeof village === 'string' && village.trim()) {
      query = query.ilike('village', `%${village.trim()}%`);
    }

    if (taluk && typeof taluk === 'string' && taluk.trim()) {
      query = query.ilike('taluk', `%${taluk.trim()}%`);
    }

    if (district && typeof district === 'string' && district.trim()) {
      query = query.ilike('district', `%${district.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      // If table doesn't exist yet in Supabase DB, return clean status message
      res.status(500).json({
        status: 'error',
        message: 'Failed to query land records from database',
        error: error.message
      });
      return;
    }

    res.json({
      status: 'success',
      count: data?.length || 0,
      data: data || []
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Unexpected server error while searching land records',
      error: err?.message || String(err)
    });
  }
});

/**
 * GET /api/records/search
 * Support query parameters as alternative: ?survey_number=...&village=...
 */
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const survey_number = req.query.survey_number as string;
    const village = req.query.village as string;
    const taluk = req.query.taluk as string;
    const district = req.query.district as string;

    if (!survey_number || !survey_number.trim()) {
      res.status(400).json({
        status: 'error',
        message: 'Survey Number query parameter (survey_number) is required.'
      });
      return;
    }

    let query = supabase
      .from('land_records')
      .select('survey_number, property_extent:land_extent_acres, village, taluk, district')
      .ilike('survey_number', `%${survey_number.trim()}%`);

    if (village && village.trim()) {
      query = query.ilike('village', `%${village.trim()}%`);
    }
    if (taluk && taluk.trim()) {
      query = query.ilike('taluk', `%${taluk.trim()}%`);
    }
    if (district && district.trim()) {
      query = query.ilike('district', `%${district.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to query land records from database',
        error: error.message
      });
      return;
    }

    res.json({
      status: 'success',
      count: data?.length || 0,
      data: data || []
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Unexpected server error while searching land records',
      error: err?.message || String(err)
    });
  }
});

export default router;
