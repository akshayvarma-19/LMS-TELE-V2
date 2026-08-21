import { Router } from 'express';
import { authenticateToken, requireOfficer } from '../middleware/auth.js';
import { officerApplicationController } from '../controllers/officerApplicationController.js';

const router = Router();

// Apply authentication to all routes in this router
router.use(authenticateToken as any);
router.use(requireOfficer as any);

router.get('/', officerApplicationController.getQueue as any);
router.get('/:id', officerApplicationController.getDetail as any);
router.post('/:id/adjudicate', officerApplicationController.adjudicate as any);

export default router;
