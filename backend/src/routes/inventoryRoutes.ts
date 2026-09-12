import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', InventoryController.getInventory);
router.post('/:id/equip', InventoryController.equipItem);
router.post('/:id/unequip', InventoryController.unequipItem);

export default router;
