import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { citizenLandController } from '../controllers/citizenLandController.js';

const router = Router();

// Apply auth middleware to all routes in this router
router.use(authenticateToken as any);

// 1. GET /api/citizen/lands/summary (must be before /:id)
router.get('/summary', citizenLandController.getLandSummary as any);

// 2. GET /api/citizen/lands/search (must be before /:id)
router.get('/search', citizenLandController.searchLands as any);

// 3. GET /api/citizen/lands
router.get('/', citizenLandController.getMyLands as any);

// 4. GET /api/citizen/lands/:id
router.get('/:id', citizenLandController.getLandById as any);

export default router;
