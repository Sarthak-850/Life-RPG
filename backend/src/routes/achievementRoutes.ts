import { Router } from 'express';
import { AchievementController } from '../controllers/achievementController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Allow achievements to be fetched with auth or publicly
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return requireAuth(req, res, next);
  }
  return AchievementController.getAchievements(req, res);
}, AchievementController.getAchievements);

export default router;
