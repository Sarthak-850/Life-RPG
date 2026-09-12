import { Response } from 'express';
import prisma from '../config/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import AchievementService from '../services/achievementService.js';

export class AchievementController {
  static async getAchievements(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (userId) {
      // Sync any eligible milestones
      await AchievementService.checkAndUnlock(prisma, userId);
    }

    const [allAchievements, userAchievements] = await Promise.all([
      prisma.achievement.findMany({
        orderBy: [{ category: 'asc' }, { requirementValue: 'asc' }],
      }),
      userId
        ? prisma.userAchievement.findMany({
            where: { userId },
          })
        : [],
    ]);

    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    const enriched = allAchievements.map((ach) => ({
      ...ach,
      isUnlocked: unlockedMap.has(ach.id),
      unlockedAt: unlockedMap.get(ach.id) || null,
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      unlockedCount: userAchievements.length,
      achievements: enriched,
    });
  }
}

export default AchievementController;
