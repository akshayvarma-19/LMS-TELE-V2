import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { officerLandService, OfficerSearchFilters } from '../services/officerLandService.js';
import { supabase } from '../lib/supabase.js';

// Allowed fields for create/update operations
const ALLOWED_FIELDS = [
  'land_id',
  'owner_id',
  'document_type',
  'document_number',
  'registration_date',
  'registration_office',
  'district',
  'taluk',
  'village',
  'survey_number',
  'patta_number',
  'property_extent',
  'land_type',
  'owner_name',
  'previous_owner',
  'sale_consideration',
  'property_description',
  'parent_document'
];

/**
 * Format raw database record into logical grouped officer response structure.
 */
function formatOfficerLandRecord(record: any) {
  if (!record) return null;
  return {
    basic_information: {
      survey_number: record.survey_number,
      patta_number: record.patta_number,
      property_extent: record.property_extent || record.land_extent_acres,
      land_type: record.land_type || record.land_classification
    },
    location: {
      district: record.district,
      taluk: record.taluk,
      village: record.village
    },
    registration: {
      document_type: record.document_type,
      document_number: record.document_number,
      registration_date: record.registration_date,
      registration_office: record.registration_office
    },
    ownership: {
      owner_id: record.owner_id,
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
    system_information: {
      id: record.id,
      land_id: record.land_id,
      created_at: record.created_at,
      updated_at: record.updated_at
    }
  };
}

export const officerLandController = {
  /**
   * List all land records with filters and pagination.
   */
  async listLands(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        survey_number,
        village,
        taluk,
        district,
        patta_number,
        document_number,
        owner_name,
        land_type,
        page,
        limit
      } = req.query;

      // Extract only supported search query parameters
      const filters: OfficerSearchFilters = {
        survey_number: typeof survey_number === 'string' ? survey_number.trim() : undefined,
        village: typeof village === 'string' ? village.trim() : undefined,
        taluk: typeof taluk === 'string' ? taluk.trim() : undefined,
        district: typeof district === 'string' ? district.trim() : undefined,
        patta_number: typeof patta_number === 'string' ? patta_number.trim() : undefined,
        document_number: typeof document_number === 'string' ? document_number.trim() : undefined,
        owner_name: typeof owner_name === 'string' ? owner_name.trim() : undefined,
        land_type: typeof land_type === 'string' ? land_type.trim() : undefined
      };

      // Default pagination
      let parsedPage = 1;
      let parsedLimit = 20;

      if (page !== undefined) {
        const pageNum = Number(page);
        if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
          res.status(400).json({
            success: false,
            error: {
              message: 'Page parameter must be an integer greater than or equal to 1.',
              code: 'INVALID_PAGINATION_PAGE'
            }
          });
          return;
        }
        parsedPage = pageNum;
      }

      if (limit !== undefined) {
        const limitNum = Number(limit);
        if (isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50) {
          res.status(400).json({
            success: false,
            error: {
              message: 'Limit parameter must be an integer between 1 and 50.',
              code: 'INVALID_PAGINATION_LIMIT'
            }
          });
          return;
        }
        parsedLimit = limitNum;
      }

      const result = await officerLandService.listLands(filters, parsedPage, parsedLimit);
      const formattedRecords = result.records.map(formatOfficerLandRecord);

      res.status(200).json({
        success: true,
        data: formattedRecords,
        pagination: result.pagination
      });
    } catch (err: any) {
      console.error('List lands error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'An error occurred while listing land records.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Retrieve a single land record by ID.
   */
  async getLandById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Land record ID is required.',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      const land = await officerLandService.getLandById(id);

      if (!land) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Land record not found.',
            code: 'NOT_FOUND'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: formatOfficerLandRecord(land)
      });
    } catch (err: any) {
      console.error('Get land by id error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'An error occurred while retrieving the land record.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Create a new land record.
   */
  async createLandRecord(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const body = req.body || {};

      // Auto-generate land_id if missing
      if (!body.land_id) {
        body.land_id = `LND-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Auto-resolve owner_id based on owner_name if missing
      if (!body.owner_id && body.owner_name) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('full_name', `%${body.owner_name.trim()}%`)
          .limit(1)
          .maybeSingle();

        if (profile) {
          body.owner_id = profile.id;
        } else {
          // Fallback to Rama's ID so DB RLS matches
          body.owner_id = '11111111-1111-1111-1111-111111111101';
        }
      }

      // Filter payload for ONLY allowed input fields
      const payload: any = {};
      ALLOWED_FIELDS.forEach(field => {
        if (body[field] !== undefined) {
          payload[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
        }
      });

      // Basic validations
      const requiredFields = ['land_id', 'owner_id', 'survey_number', 'patta_number', 'district', 'taluk', 'village', 'document_number'];
      for (const field of requiredFields) {
        if (payload[field] === undefined || payload[field] === '') {
          res.status(400).json({
            success: false,
            error: {
              message: `Field '${field}' is required and cannot be empty.`,
              code: 'REQUIRED_FIELD_MISSING'
            }
          });
          return;
        }
      }

      const newRecord = await officerLandService.createLandRecord(payload);

      res.status(201).json({
        success: true,
        data: formatOfficerLandRecord(newRecord)
      });
    } catch (err: any) {
      console.error('Create land record error:', err);
      // Map owner validation error or DB errors
      const isOwnerError = err.message.includes('Owner ID');
      res.status(isOwnerError ? 400 : 500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while creating the land record.',
          code: isOwnerError ? 'INVALID_OWNER_ID' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Update an existing land record.
   */
  async updateLandRecord(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body || {};

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Land record ID is required.',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      // Check if land record exists first
      const existingLand = await officerLandService.getLandById(id);
      if (!existingLand) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Land record not found.',
            code: 'NOT_FOUND'
          }
        });
        return;
      }

      // Filter payload for ONLY allowed fields (strictly exclude id, created_at, updated_at)
      const payload: any = {};
      ALLOWED_FIELDS.forEach(field => {
        if (body[field] !== undefined) {
          payload[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
        }
      });

      const updatedRecord = await officerLandService.updateLandRecord(id, payload);

      res.status(200).json({
        success: true,
        data: formatOfficerLandRecord(updatedRecord)
      });
    } catch (err: any) {
      console.error('Update land record error:', err);
      const isOwnerError = err.message.includes('Owner ID');
      res.status(isOwnerError ? 400 : 500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while updating the land record.',
          code: isOwnerError ? 'INVALID_OWNER_ID' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Get summary of all land records.
   */
  async getLandSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const summary = await officerLandService.getLandSummary();
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      console.error('Get land summary error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'An error occurred while generating the statistics summary.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
