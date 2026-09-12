import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import RPGEngine from '../services/rpgEngine.js';

export class CharacterController {
  static async getCharacter(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;

    const character = await prisma.character.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!character) {
      res.status(404).json({ success: false, message: 'Character not found.' });
      return;
    }

    // Fetch equipped item details
    const equippedIds = [
      character.equippedWeaponId,
      character.equippedArmorId,
      character.equippedHeadId,
      character.equippedAuraId,
    ].filter((id): id is string => Boolean(id));

    const equippedItems = await prisma.item.findMany({
      where: { id: { in: equippedIds } },
    });

    // Calculate progression details
    const nextLevelXP = RPGEngine.getRequiredXP(character.level);
    const progressPercentage = RPGEngine.getProgressPercentage(character.xp, character.level);

    // Count completions and stats
    const [totalCompletedQuests, totalInventoryCount, unlockedAchievementsCount] =
      await Promise.all([
        prisma.task.count({ where: { userId, isCompleted: true } }),
        prisma.inventory.count({ where: { userId } }),
        prisma.userAchievement.count({ where: { userId } }),
      ]);

    res.status(200).json({
      success: true,
      character: {
        ...character,
        nextLevelXP,
        progressPercentage,
        equippedItems: {
          weapon: equippedItems.find((i) => i.id === character.equippedWeaponId) || null,
          armor: equippedItems.find((i) => i.id === character.equippedArmorId) || null,
          headwear: equippedItems.find((i) => i.id === character.equippedHeadId) || null,
          aura: equippedItems.find((i) => i.id === character.equippedAuraId) || null,
        },
        stats: {
          totalCompletedQuests,
          totalInventoryCount,
          unlockedAchievementsCount,
        },
      },
    });
  }

  static async updateAppearance(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { avatarColor } = req.body;

    const allowedColors = ['purple', 'cyan', 'crimson', 'amber', 'emerald'];
    if (!avatarColor || !allowedColors.includes(avatarColor)) {
      res.status(400).json({
        success: false,
        message: `Invalid avatar color. Allowed: ${allowedColors.join(', ')}`,
      });
      return;
    }

    const updated = await prisma.character.update({
      where: { userId },
      data: { avatarColor },
    });

    res.status(200).json({
      success: true,
      message: 'Avatar appearance refreshed.',
      character: updated,
    });
  }
}

export default CharacterController;
