import { Router } from 'express';
import { authenticateToken, requireCitizen } from '../middleware/auth.js';
import { citizenApplicationController } from '../controllers/citizenApplicationController.js';

const router = Router();

// Apply authentication to all routes in this router
router.use(authenticateToken as any);
router.use(requireCitizen as any);

router.post('/', citizenApplicationController.submitApplication as any);
router.get('/', citizenApplicationController.getMyApplications as any);

export default router;
