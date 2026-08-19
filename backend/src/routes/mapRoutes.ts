import { Router } from 'express';
import { authenticateToken, requireOfficer } from '../middleware/auth.js';
import { mapController } from '../controllers/mapController.js';

const router = Router();

// Apply authentication token verification to all routes in this router
router.use(authenticateToken as any);

// 1. GET /api/map/lands (Officer only)
router.get('/lands', requireOfficer as any, mapController.listLands as any);

// 2. GET /api/map/lands/:id (Citizen owns the land OR Officer)
router.get('/lands/:id', mapController.getLandMap as any);

export default router;
