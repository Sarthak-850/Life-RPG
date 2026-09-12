import { Router } from 'express';
import { HistoryController } from '../controllers/historyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', HistoryController.getHistory);

export default router;
