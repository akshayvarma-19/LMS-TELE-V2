import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { citizenLandService } from '../services/citizenLandService.js';

/**
 * Format raw database record into the logical grouped response structure.
 */
function formatLandRecord(record: any) {
  if (!record) return null;
  return {
    id: record.id,
    land_id: record.land_id,
    owner_id: record.owner_id,
    basic_information: {
      survey_number: record.survey_number,
      patta_number: record.patta_number,
      property_extent: record.property_extent || record.land_extent_acres,
      land_type: record.land_type || record.land_classification
    },
    location: {
      district: record.district,
      taluk: record.taluk,
      village: record.village,
      latitude: record.latitude ?? null,
      longitude: record.longitude ?? null
    },
    registration: {
      document_type: record.document_type,
      document_number: record.document_number,
      registration_date: record.registration_date,
      registration_office: record.registration_office
    },
    ownership: {
      owner_name: record.owner_name,
      previous_owner: record.previous_owner
    },
    transaction_information: {
      sale_consideration: record.sale_consideration,
      parent_document: record.parent_document
    },
    description: {
      property_description: record.property_description
    },
    latitude: record.latitude ?? null,
    longitude: record.longitude ?? null,
    created_at: record.created_at,
    updated_at: record.updated_at
  };
}

export const citizenLandController = {
  /**
   * Get all land records for the authenticated user.
   */
  async getMyLands(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      const lands = await citizenLandService.getMyLands(userId);
      const formattedLands = lands.map(formatLandRecord);

      res.status(200).json({
        success: true,
        data: formattedLands
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'Internal server error while fetching land records',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Get details of a single land record owned by the user.
   */
  async getLandById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      // Simple validation for ID parameter
      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Land record ID is required',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      const land = await citizenLandService.getLandById(userId, id);

      if (!land) {
        // Return 404 to avoid leaking whether another user's land exists
        res.status(404).json({
          success: false,
          error: {
            message: 'Land record not found',
            code: 'NOT_FOUND'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: formatLandRecord(land)
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'Internal server error while retrieving land record',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Search user's own land records.
   */
  async searchLands(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      const { survey_number, village, taluk, district, patta_number, land_id } = req.query;

      // Extract filters
      const filters = {
        survey_number: survey_number as string | undefined,
        village: village as string | undefined,
        taluk: taluk as string | undefined,
        district: district as string | undefined,
        patta_number: patta_number as string | undefined,
        land_id: land_id as string | undefined
      };

      // Perform search
      const lands = await citizenLandService.searchLands(userId, filters);
      const formattedLands = lands.map(formatLandRecord);

      res.status(200).json({
        success: true,
        data: formattedLands
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'Internal server error during search',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Get summary of user's own land records.
   */
  async getLandSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      const summary = await citizenLandService.getLandSummary(userId);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'Internal server error aggregating summary',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
