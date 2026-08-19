import { Router } from 'express';
import { authenticateToken, requireOfficer } from '../middleware/auth.js';
import { officerLandController } from '../controllers/officerLandController.js';

const router = Router();

// Apply auth + role middlewares to all routes in this router
router.use(authenticateToken as any);
router.use(requireOfficer as any);

// 1. GET /api/officer/lands/summary (must be before /:id)
router.get('/summary', officerLandController.getLandSummary as any);

// 2. GET /api/officer/lands
router.get('/', officerLandController.listLands as any);

// 3. GET /api/officer/lands/:id
router.get('/:id', officerLandController.getLandById as any);

// 4. POST /api/officer/lands
router.post('/', officerLandController.createLandRecord as any);

// 5. PUT /api/officer/lands/:id
router.put('/:id', officerLandController.updateLandRecord as any);

export default router;
