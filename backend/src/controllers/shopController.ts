import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import ShopService from '../services/shopService.js';
import AchievementService from '../services/achievementService.js';

export class ShopController {
  static async getItems(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    const [items, userInventory] = await Promise.all([
      prisma.item.findMany({
        orderBy: [{ price: 'asc' }],
      }),
      userId
        ? prisma.inventory.findMany({
            where: { userId },
            select: { itemId: true, isEquipped: true },
          })
        : [],
    ]);

    const ownedMap = new Map(userInventory.map((inv) => [inv.itemId, inv.isEquipped]));

    const enrichedItems = items.map((item) => ({
      ...item,
      isOwned: ownedMap.has(item.id),
      isEquipped: ownedMap.get(item.id) || false,
    }));

    res.status(200).json({
      success: true,
      count: enrichedItems.length,
      items: enrichedItems,
    });
  }

  static async purchaseItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { itemId } = req.params;

    try {
      const result = await ShopService.purchaseItem(prisma, userId, itemId);

      // Check achievements (e.g. FIRST_PURCHASE)
      const newAchievements = await AchievementService.checkAndUnlock(prisma, userId);

      const finalCharacter = await prisma.character.findUnique({ where: { userId } });

      res.status(200).json({
        success: true,
        message: 'Item forged and added to your inventory!',
        inventoryEntry: result.inventoryEntry,
        remainingGold: finalCharacter?.gold ?? result.remainingGold,
        character: finalCharacter,
        unlockedAchievements: newAchievements,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to purchase item.',
      });
    }
  }
}

export default ShopController;
