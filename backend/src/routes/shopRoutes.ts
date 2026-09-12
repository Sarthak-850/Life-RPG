import { Router } from 'express';
import { ShopController } from '../controllers/shopController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Allow reading shop items publicly or with auth to mark owned
router.get('/items', (req, res, next) => {
  // If authorization header exists, process it, else proceed
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return requireAuth(req, res, next);
  }
  return ShopController.getItems(req, res);
}, ShopController.getItems);

router.post('/items/:itemId/purchase', requireAuth, ShopController.purchaseItem);

export default router;
