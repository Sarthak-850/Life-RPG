import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import ShopService from '../services/shopService.js';

export class InventoryController {
  static async getInventory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const inventory = await prisma.inventory.findMany({
      where: { userId },
      include: {
        item: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  }

  static async equipItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
      const result = await ShopService.toggleEquipItem(prisma, userId, id, true);
      res.status(200).json({
        success: true,
        message: `${result.item.name} equipped!`,
        result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to equip item.',
      });
    }
  }

  static async unequipItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
      const result = await ShopService.toggleEquipItem(prisma, userId, id, false);
      res.status(200).json({
        success: true,
        message: `${result.item.name} unequipped.`,
        result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to unequip item.',
      });
    }
  }
}

export default InventoryController;
