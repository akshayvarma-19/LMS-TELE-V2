import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { assistantController } from '../controllers/assistantController.js';

const router = Router();

// Expose POST /api/assistant/message
router.post('/message', authenticateToken as any, assistantController.handleMessage as any);

export default router;
