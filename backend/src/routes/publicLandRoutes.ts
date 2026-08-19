import { Router } from 'express';
import { publicLandController } from '../controllers/publicLandController.js';

const router = Router();

// GET /api/lands/search (public search endpoint)
router.get('/search', publicLandController.searchPublicLands as any);

export default router;
