import { Router } from 'express';
import { authenticateToken, requireOfficer } from '../middleware/auth.js';
import { grievanceController } from '../controllers/grievanceController.js';

const router = Router();

// Apply auth + officer checks to all routes in this router
router.use(authenticateToken as any);
router.use(requireOfficer as any);

// 1. GET /api/officer/grievances/:id/tracking
router.get('/:id/tracking', grievanceController.getGrievanceTimeline as any);

// 2. GET /api/officer/grievances/:id
router.get('/:id', grievanceController.officerGetGrievanceById as any);

// 3. GET /api/officer/grievances
router.get('/', grievanceController.officerListGrievances as any);

// 4. PUT /api/officer/grievances/:id/status
router.put('/:id/status', grievanceController.officerUpdateGrievanceStatus as any);

export default router;
