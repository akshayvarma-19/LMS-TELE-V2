import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { notificationService } from '../services/notificationService.js';

export const notificationController = {
  /**
   * GET /api/notifications
   * List all notifications for the authenticated user.
   */
  async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed.',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      const notifications = await notificationService.listNotifications(userId);

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while fetching notifications.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * POST /api/notifications/:id/read
   * Mark a notification as read.
   */
  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const notificationId = req.params.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication failed.',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Notification ID is required.',
            code: 'BAD_REQUEST'
          }
        });
        return;
      }

      await notificationService.markAsRead(notificationId as string, userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Notification marked as read successfully.'
        }
      });
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      res.status(500).json({
        success: false,
        error: {
          message: err.message || 'An error occurred while updating notification.',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
