import { PrismaClient } from '@prisma/client';

export class AchievementService {
  /**
   * Checks and unlocks any newly eligible achievements for a user.
   * Returns an array of newly unlocked achievement objects.
   */
  static async checkAndUnlock(
    prisma: PrismaClient,
    userId: string
  ): Promise<any[]> {
    // 1. Fetch character, task counts, inventory, and existing user achievements
    const [character, userAchievements, totalCompleted, fitnessCompleted, scholarCompleted, inventoryCount, allAchievements] =
      await Promise.all([
        prisma.character.findUnique({ where: { userId } }),
        prisma.userAchievement.findMany({ where: { userId } }),
        prisma.task.count({ where: { userId, isCompleted: true } }),
        prisma.task.count({ where: { userId, isCompleted: true, category: 'Fitness' } }),
        prisma.task.count({
          where: {
            userId,
            isCompleted: true,
            category: { in: ['Study', 'Coding'] },
          },
        }),
        prisma.inventory.count({ where: { userId } }),
        prisma.achievement.findMany(),
      ]);

    if (!character) return [];

    const unlockedKeys = new Set(userAchievements.map((ua) => ua.achievementId));
    const newlyUnlocked: any[] = [];

    for (const ach of allAchievements) {
      if (unlockedKeys.has(ach.id)) continue;

      let qualified = false;

      switch (ach.key) {
        case 'FIRST_QUEST':
          qualified = totalCompleted >= 1;
          break;
        case 'LEVEL_5':
          qualified = character.level >= 5;
          break;
        case 'LEVEL_10':
          qualified = character.level >= 10;
          break;
        case 'WARRIOR_5':
          qualified = fitnessCompleted >= 5;
          break;
        case 'SCHOLAR_5':
          qualified = scholarCompleted >= 5;
          break;
        case 'STREAK_3':
          qualified = character.currentStreak >= 3;
          break;
        case 'STREAK_7':
          qualified = character.currentStreak >= 7;
          break;
        case 'GOLD_200':
          qualified = character.gold >= 200;
          break;
        case 'FIRST_PURCHASE':
          qualified = inventoryCount >= 1;
          break;
        case 'QUESTS_10':
          qualified = totalCompleted >= 10;
          break;
      }

      if (qualified) {
        // Unlock achievement atomically
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: ach.id,
          },
        });

        // Award achievement bonuses to character
        await prisma.character.update({
          where: { userId },
          data: {
            xp: { increment: ach.xpReward },
            gold: { increment: ach.goldReward },
          },
        });

        // Record activity log
        await prisma.activityLog.create({
          data: {
            userId,
            type: 'ACHIEVEMENT_UNLOCKED',
            title: `Achievement Unlocked: ${ach.name}`,
            description: ach.description,
            metadata: JSON.stringify({
              achievementKey: ach.key,
              xpReward: ach.xpReward,
              goldReward: ach.goldReward,
            }),
          },
        });

        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }
}

export default AchievementService;
