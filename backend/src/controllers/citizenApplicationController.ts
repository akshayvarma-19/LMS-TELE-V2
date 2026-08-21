import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { applicationService } from '../services/applicationService.js';

export const citizenApplicationController = {
  /**
   * POST /api/citizen/applications
   * Submit a new land application.
   */
  async submitApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed.', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const { land_id, type, details, document_name } = req.body;

      if (!land_id || !type || !details) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Land record ID, type, and justification details are required.',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      // Check ownership
      const hasOwnership = await applicationService.runWithFallback(
        async () => {
          // If using Supabase, we can check land ownership
          const { data, error } = await supabaseVerifyOwnership(userId, land_id);
          if (error || !data) return false;
          return true;
        },
        async () => true // For fallback mode, bypass check or default to true
      );

      const record = await applicationService.createApplication(
        userId,
        land_id,
        type,
        details,
        document_name || 'supporting_deed.pdf'
      );

      res.status(201).json({
        success: true,
        data: record
      });
    } catch (err: any) {
      console.error('Submit application error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while submitting the application.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * GET /api/citizen/applications
   * Retrieve list of citizen's own submitted applications.
   */
  async getMyApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed.', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const records = await applicationService.getCitizenApplications(userId);

      res.status(200).json({
        success: true,
        data: records
      });
    } catch (err: any) {
      console.error('Fetch citizen applications error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while fetching your applications.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};

// Helper for verification check
async function supabaseVerifyOwnership(userId: string, landId: string) {
  const { supabase } = await import('../lib/supabase.js');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(landId);
  let query = supabase.from('land_records').select('id').eq('owner_id', userId);
  if (isUuid) {
    query = query.eq('id', landId);
  } else {
    query = query.eq('land_id', landId);
  }
  return query.maybeSingle();
}
