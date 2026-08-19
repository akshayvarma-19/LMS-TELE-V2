import { Router } from 'express';
import { authenticateToken, requireCitizen } from '../middleware/auth.js';
import { grievanceController } from '../controllers/grievanceController.js';

const router = Router();

// Apply auth + citizen checks to all routes in this router
router.use(authenticateToken as any);
router.use(requireCitizen as any);

// 1. GET /api/citizen/grievances/:id/tracking
router.get('/:id/tracking', grievanceController.getGrievanceTimeline as any);

// 2. GET /api/citizen/grievances/:id
router.get('/:id', grievanceController.citizenGetGrievanceById as any);

// 3. GET /api/citizen/grievances
router.get('/', grievanceController.citizenListGrievances as any);

// 4. POST /api/citizen/grievances
router.post('/', grievanceController.citizenCreateGrievance as any);

export default router;
