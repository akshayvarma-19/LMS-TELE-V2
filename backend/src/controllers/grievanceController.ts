import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { grievanceService, OfficerGrievanceFilters } from '../services/grievanceService.js';

// Valid categories according to types
const VALID_CATEGORIES = ['ocr_mismatch', 'ownership_dispute', 'survey_error', 'illegal_mutation', 'other'];

// Valid statuses according to types
const VALID_STATUSES = ['submitted', 'under_review', 'info_required', 'resolved', 'rejected'];

export const grievanceController = {
  /**
   * Citizen - Create a new grievance.
   */
  async citizenCreateGrievance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const { land_id, category, description } = req.body;

      // Basic validations
      if (!land_id || typeof land_id !== 'string' || land_id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Land ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      if (!category || !VALID_CATEGORIES.includes(category)) {
        res.status(400).json({
          success: false,
          error: {
            message: `Category is required and must be one of: ${VALID_CATEGORIES.join(', ')}`,
            code: 'INVALID_CATEGORY'
          }
        });
        return;
      }

      if (!description || typeof description !== 'string' || description.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Description is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const grievance = await grievanceService.createGrievance(
        userId,
        land_id.trim(),
        category,
        description.trim()
      );

      res.status(201).json({
        success: true,
        data: {
          grievance_id: grievance.id,
          grievance_number: grievance.grievance_number,
          status: grievance.status
        }
      });
    } catch (err: any) {
      console.error('Create grievance controller error:', err);
      const isAuthError = err.message.includes('Verification failed');
      res.status(isAuthError ? 403 : 500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while creating the grievance.',
          code: isAuthError ? 'ACCESS_DENIED' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Citizen - List own grievances.
   */
  async citizenListGrievances(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const { page, limit } = req.query;

      // Default pagination
      let parsedPage = 1;
      let parsedLimit = 20;

      if (page !== undefined) {
        const pageNum = Number(page);
        if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
          res.status(400).json({
            success: false,
            error: { message: 'Page parameter must be an integer greater than or equal to 1.', code: 'INVALID_PAGINATION_PAGE' }
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
            error: { message: 'Limit parameter must be an integer between 1 and 50.', code: 'INVALID_PAGINATION_LIMIT' }
          });
          return;
        }
        parsedLimit = limitNum;
      }

      const result = await grievanceService.getCitizenGrievances(userId, parsedPage, parsedLimit);

      res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (err: any) {
      console.error('List citizen grievances error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to retrieve land records grievances.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * Citizen - Get details of a single grievance.
   */
  async citizenGetGrievanceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
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
          error: { message: 'Grievance ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const grievance = await grievanceService.getCitizenGrievanceById(userId, id);

      if (!grievance) {
        res.status(404).json({
          success: false,
          error: { message: 'Grievance not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: grievance
      });
    } catch (err: any) {
      console.error('Get citizen grievance by ID error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to retrieve grievance details.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * Citizen/Officer - Get tracking timeline updates of a grievance.
   */
  async getGrievanceTimeline(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.user_metadata?.role;
      const { id } = req.params;

      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Grievance ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      // Fetch grievance details based on role to form timeline header
      let grievanceDetails = null;
      if (userRole === 'citizen') {
        grievanceDetails = await grievanceService.getCitizenGrievanceById(userId, id);
      } else if (userRole === 'officer') {
        grievanceDetails = await grievanceService.getOfficerGrievanceById(id);
      }

      if (!grievanceDetails) {
        res.status(404).json({
          success: false,
          error: { message: 'Grievance not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      const updates = await grievanceService.getGrievanceUpdates(userId, id, userRole);

      // Map DB schema `comment` to conceptually requested `remarks` or return both
      const formattedTimeline = updates.map(u => ({
        status: u.new_status,
        old_status: u.old_status,
        remarks: u.comment,
        updated_by: u.updated_by,
        updated_at: u.created_at
      }));

      res.status(200).json({
        success: true,
        data: {
          grievance: grievanceDetails,
          timeline: formattedTimeline
        }
      });
    } catch (err: any) {
      console.error('Get grievance timeline error:', err);
      res.status(500).json({
        success: false,
        error: { message: err.message || 'Failed to retrieve timeline details.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * Officer - List all grievances.
   */
  async officerListGrievances(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, category, district, taluk, village, page, limit } = req.query;

      // Extract only supported filters
      const filters: OfficerGrievanceFilters = {
        status: typeof status === 'string' ? status.trim() : undefined,
        category: typeof category === 'string' ? category.trim() : undefined,
        district: typeof district === 'string' ? district.trim() : undefined,
        taluk: typeof taluk === 'string' ? taluk.trim() : undefined,
        village: typeof village === 'string' ? village.trim() : undefined
      };

      // Default pagination
      let parsedPage = 1;
      let parsedLimit = 20;

      if (page !== undefined) {
        const pageNum = Number(page);
        if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
          res.status(400).json({
            success: false,
            error: { message: 'Page parameter must be an integer greater than or equal to 1.', code: 'INVALID_PAGINATION_PAGE' }
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
            error: { message: 'Limit parameter must be an integer between 1 and 50.', code: 'INVALID_PAGINATION_LIMIT' }
          });
          return;
        }
        parsedLimit = limitNum;
      }

      const result = await grievanceService.listOfficerGrievances(filters, parsedPage, parsedLimit);

      res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (err: any) {
      console.error('Officer list grievances error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to retrieve grievances records.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * Officer - Get details of a single grievance.
   */
  async officerGetGrievanceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Grievance ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const grievance = await grievanceService.getOfficerGrievanceById(id);

      if (!grievance) {
        res.status(404).json({
          success: false,
          error: { message: 'Grievance not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: grievance
      });
    } catch (err: any) {
      console.error('Get officer grievance by ID error:', err);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to retrieve grievance details.', code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },

  /**
   * Officer - Update grievance status/timeline.
   */
  async officerUpdateGrievanceStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const officerId = req.user?.id;
      if (!officerId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const { id } = req.params;
      const { status, remark } = req.body;

      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Grievance ID is required.', code: 'BAD_REQUEST' }
        });
        return;
      }

      if (!status || !VALID_STATUSES.includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            message: `Status is required and must be one of: ${VALID_STATUSES.join(', ')}`,
            code: 'INVALID_STATUS'
          }
        });
        return;
      }

      if (!remark || typeof remark !== 'string' || remark.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Remark is required and cannot be empty.', code: 'BAD_REQUEST' }
        });
        return;
      }

      const updatedGrievance = await grievanceService.updateGrievanceStatus(
        officerId,
        id,
        status,
        remark.trim()
      );

      res.status(200).json({
        success: true,
        data: updatedGrievance
      });
    } catch (err: any) {
      console.error('Officer update grievance status error:', err);
      const isNotFound = err.message.includes('Grievance not found');
      res.status(isNotFound ? 404 : 500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while updating the grievance status.',
          code: isNotFound ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
