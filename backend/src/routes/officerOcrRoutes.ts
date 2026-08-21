import { Router } from 'express';
import { authenticateToken, requireOfficer } from '../middleware/auth.js';
import { ocrExtractionController } from '../controllers/ocrExtractionController.js';

const router = Router();

// Apply auth + officer checks to all routes in this router
router.use(authenticateToken as any);
router.use(requireOfficer as any);

router.get('/documents', ocrExtractionController.getAllDocuments as any);

export default router;
