import { Router } from 'express';
import { authenticateToken, requireCitizen } from '../middleware/auth.js';
import { ocrExtractionController } from '../controllers/ocrExtractionController.js';

const router = Router();

// Apply auth + citizen checks to all routes in this router
router.use(authenticateToken as any);
router.use(requireCitizen as any);

// 1. POST /api/citizen/ocr/:id/extract
router.post('/:id/extract', ocrExtractionController.extractOcr as any);

// 2. GET /api/citizen/ocr/:id/extracted
router.get('/:id/extracted', ocrExtractionController.getExtractedData as any);

// 3. GET /api/citizen/ocr/:id/verify
router.get('/:id/verify', ocrExtractionController.verifyOcr as any);

// 4. POST /api/citizen/ocr/:id/reprocess
router.post('/:id/reprocess', ocrExtractionController.reprocessOcr as any);

export default router;
