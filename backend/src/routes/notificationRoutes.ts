import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { notificationController } from '../controllers/notificationController.js';

const router = Router();

// Secure all notification endpoints
router.use(authenticateToken as any);

// GET /api/notifications -> Get all notifications
router.get('/', notificationController.getNotifications as any);

// POST /api/notifications/:id/read -> Mark notification as read
router.post('/:id/read', notificationController.markAsRead as any);

export default router;
