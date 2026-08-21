import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { applicationService } from '../services/applicationService.js';

export const officerApplicationController = {
  /**
   * GET /api/officer/applications
   * Get queue of pending applications.
   */
  async getQueue(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.user_metadata?.role || 'citizen';
      if (userRole !== 'officer') {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. Officers only.', code: 'FORBIDDEN' }
        });
        return;
      }

      const { status, type } = req.query;

      const records = await applicationService.getOfficerApplications({
        status: typeof status === 'string' ? status : undefined,
        type: typeof type === 'string' ? type : undefined
      });

      res.status(200).json({
        success: true,
        data: records
      });
    } catch (err: any) {
      console.error('Fetch officer application queue error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while fetching the application queue.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * GET /api/officer/applications/:id
   * Get single application details.
   */
  async getDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.user_metadata?.role || 'citizen';
      if (userRole !== 'officer') {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. Officers only.', code: 'FORBIDDEN' }
        });
        return;
      }

      const { id } = req.params;

      const record = await applicationService.getApplicationById(id as string);

      if (!record) {
        res.status(404).json({
          success: false,
          error: { message: 'Application not found.', code: 'NOT_FOUND' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: record
      });
    } catch (err: any) {
      console.error('Fetch officer application detail error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while retrieving application details.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * POST /api/officer/applications/:id/adjudicate
   * Adjudicate status (approve, request_info, reject).
   */
  async adjudicate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const officerId = req.user?.id;
      const userRole = req.user?.user_metadata?.role || 'citizen';

      if (!officerId || userRole !== 'officer') {
        res.status(403).json({
          success: false,
          error: { message: 'Access denied. Officers only.', code: 'FORBIDDEN' }
        });
        return;
      }

      const { id } = req.params;
      const { action, remarks } = req.body;

      if (!action || !['approve', 'request_info', 'reject'].includes(action)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'A valid action (approve, request_info, or reject) is required.',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      if ((action === 'request_info' || action === 'reject') && (!remarks || !remarks.trim())) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Remarks / reason justification is required for requesting information or rejecting.',
            code: 'REMARKS_REQUIRED'
          }
        });
        return;
      }

      const record = await applicationService.adjudicateApplication(
        officerId,
        id as string,
        action,
        remarks || ''
      );

      res.status(200).json({
        success: true,
        data: record
      });
    } catch (err: any) {
      console.error('Adjudicate application error:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while adjudicating the application.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
