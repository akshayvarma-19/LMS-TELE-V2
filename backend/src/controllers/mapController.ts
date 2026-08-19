import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { mapService, MapFilters } from '../services/mapService.js';

export const mapController = {
  /**
   * GET /api/map/lands/:id
   * Returns land details and GIS map placeholders.
   */
  async getLandMap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.user_metadata?.role || 'citizen';
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Land ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const result = await mapService.getLandMapData(id, userId, userRole);

      if (!result) {
        res.status(404).json({
          success: false,
          error: { message: 'Land record not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('Get land map controller error:', err);
      const isAccessDenied = err.message.includes('Access denied');
      res.status(isAccessDenied ? 403 : 500).json({
        success: false,
        error: {
          message: err.message || 'Failed to retrieve land record map data.',
          code: isAccessDenied ? 'ACCESS_DENIED' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * GET /api/map/lands
   * Returns a filtered list of lands (Officer only).
   */
  async listLands(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.user_metadata?.role;
      
      // Secondary check just to be safe
      if (userRole !== 'officer') {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. Officer role required.', code: 'FORBIDDEN' }
        });
        return;
      }

      const { survey_number, village, taluk, district } = req.query;

      const filters: MapFilters = {
        survey_number: typeof survey_number === 'string' ? survey_number : undefined,
        village: typeof village === 'string' ? village : undefined,
        taluk: typeof taluk === 'string' ? taluk : undefined,
        district: typeof district === 'string' ? district : undefined
      };

      const result = await mapService.listLandsForMap(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('List lands map controller error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to search land records for map.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }
};
