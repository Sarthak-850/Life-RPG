import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthenticatedRequest, QuestCategory, QuestDifficulty } from '../types/index.js';
import RPGEngine from '../services/rpgEngine.js';
import StreakService from '../services/streakService.js';
import AchievementService from '../services/achievementService.js';

export const questCategories = [
  'Coding',
  'Study',
  'Fitness',
  'Health',
  'Reading',
  'Work',
  'Personal',
  'Mindfulness',
  'Other',
] as const;

export const questDifficulties = ['Easy', 'Medium', 'Hard', 'Epic'] as const;

export const createQuestSchema = z.object({
  title: z.string().min(1, 'Quest title is required').max(120, 'Quest title too long'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  category: z.enum(questCategories),
  difficulty: z.enum(questDifficulties),
});

export const updateQuestSchema = z.object({
  title: z.string().min(1, 'Quest title is required').max(120, 'Quest title too long').optional(),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  category: z.enum(questCategories).optional(),
  difficulty: z.enum(questDifficulties).optional(),
});

export class QuestController {
  static async getQuests(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { category, difficulty, isCompleted } = req.query;

    const whereClause: any = { userId };
    if (category && typeof category === 'string') {
      whereClause.category = category;
    }
    if (difficulty && typeof difficulty === 'string') {
      whereClause.difficulty = difficulty;
    }
    if (isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === 'true';
    }

    const quests = await prisma.task.findMany({
      where: whereClause,
      orderBy: [
        { isCompleted: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.status(200).json({
      success: true,
      count: quests.length,
      quests,
    });
  }

  static async getQuestById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const quest = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!quest) {
      res.status(404).json({ success: false, message: 'Quest not found or access denied.' });
      return;
    }

    res.status(200).json({ success: true, quest });
  }

  static async createQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { title, description, category, difficulty } = req.body;

    // Server-authoritative reward calculation
    const rewards = RPGEngine.calculateQuestRewards(
      category as QuestCategory,
      difficulty as QuestDifficulty
    );

    const quest = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        category,
        difficulty,
        xpReward: rewards.xpReward,
        goldReward: rewards.goldReward,
        attributeReward: rewards.attributeReward,
        attributeAmount: rewards.attributeAmount,
        isCompleted: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'New Quest forged in your journal!',
      quest,
    });
  }

  static async updateQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, description, category, difficulty } = req.body;

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Quest not found or access denied.' });
      return;
    }

    if (existing.isCompleted) {
      res.status(400).json({ success: false, message: 'Completed quests cannot be modified.' });
      return;
    }

    const updatedCategory = (category || existing.category) as QuestCategory;
    const updatedDifficulty = (difficulty || existing.difficulty) as QuestDifficulty;
    const rewards = RPGEngine.calculateQuestRewards(updatedCategory, updatedDifficulty);

    const updatedQuest = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
        xpReward: rewards.xpReward,
        goldReward: rewards.goldReward,
        attributeReward: rewards.attributeReward,
        attributeAmount: rewards.attributeAmount,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Quest successfully updated.',
      quest: updatedQuest,
    });
  }

  static async deleteQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Quest not found or access denied.' });
      return;
    }

    await prisma.task.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Quest banished from your journal.',
    });
  }

  static async completeQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    // 1. Fetch quest with user verification
    const quest = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!quest) {
      res.status(404).json({ success: false, message: 'Quest not found or access denied.' });
      return;
    }

    if (quest.isCompleted) {
      res.status(400).json({ success: false, message: 'This quest has already been completed.' });
      return;
    }

    // 2. Process completion atomically
    const completionResult = await prisma.$transaction(async (tx) => {
      const now = new Date();

      // Mark quest completed
      const updatedQuest = await tx.task.update({
        where: { id },
        data: {
          isCompleted: true,
          completedAt: now,
        },
      });

      // Record task completion
      await tx.taskCompletion.create({
        data: {
          userId,
          taskId: quest.id,
          xpEarned: quest.xpReward,
          goldEarned: quest.goldReward,
          attribute: quest.attributeReward,
          attributeAmount: quest.attributeAmount,
          completedAt: now,
        },
      });

      // Fetch character
      const character = await tx.character.findUnique({ where: { userId } });
      if (!character) {
        throw new Error('Character not found');
      }

      // Process XP and Level Progression
      const xpProgression = RPGEngine.processXPGain(
        character.level,
        character.xp,
        quest.xpReward
      );

      // Process Streak
      const streakResult = StreakService.calculateStreak(
        character.currentStreak,
        character.longestStreak,
        character.lastActivityDate,
        now
      );

      // Process Attribute updates
      const attributeUpdates: any = {};
      const attrKey = quest.attributeReward.toLowerCase();
      if (attrKey === 'strength') {
        attributeUpdates.strength = character.strength + quest.attributeAmount;
      } else if (attrKey === 'intellect') {
        attributeUpdates.intellect = character.intellect + quest.attributeAmount;
      } else if (attrKey === 'agility') {
        attributeUpdates.agility = character.agility + quest.attributeAmount;
      } else if (attrKey === 'wisdom') {
        attributeUpdates.wisdom = character.wisdom + quest.attributeAmount;
      } else if (attrKey === 'discipline') {
        attributeUpdates.discipline = character.discipline + quest.attributeAmount;
      }

      // Dynamic title
      const newTitle = RPGEngine.getTitleForLevel(xpProgression.newLevel);

      // Update Character
      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          level: xpProgression.newLevel,
          xp: xpProgression.newXP,
          gold: character.gold + quest.goldReward,
          currentStreak: streakResult.newStreak,
          longestStreak: streakResult.newLongestStreak,
          lastActivityDate: now,
          title: newTitle,
          ...attributeUpdates,
        },
      });

      // Create Quest Completion Activity Log
      await tx.activityLog.create({
        data: {
          userId,
          type: 'QUEST_COMPLETE',
          title: `Quest Completed: ${quest.title}`,
          description: `Earned ${quest.xpReward} XP, ${quest.goldReward} Gold, and +${quest.attributeAmount} ${quest.attributeReward}.`,
          metadata: JSON.stringify({
            questId: quest.id,
            xp: quest.xpReward,
            gold: quest.goldReward,
            attribute: quest.attributeReward,
            amount: quest.attributeAmount,
          }),
        },
      });

      // Create Level Up Activity Log if leveled up
      if (xpProgression.leveledUp) {
        await tx.activityLog.create({
          data: {
            userId,
            type: 'LEVEL_UP',
            title: `Ascended to Level ${xpProgression.newLevel}!`,
            description: `Unlocked title "${newTitle}". Next milestone awaits.`,
            metadata: JSON.stringify({
              previousLevel: character.level,
              newLevel: xpProgression.newLevel,
              levelsGained: xpProgression.levelsGained,
            }),
          },
        });
      }

      return {
        updatedQuest,
        updatedCharacter,
        xpProgression,
        streakResult,
      };
    });

    // 3. Evaluate Achievements
    const newAchievements = await AchievementService.checkAndUnlock(prisma, userId);

    // 4. Fetch final updated character state with any achievement bonuses
    const finalCharacter = await prisma.character.findUnique({ where: { userId } });

    res.status(200).json({
      success: true,
      message: `Quest complete! +${quest.xpReward} XP, +${quest.goldReward} Gold, +${quest.attributeAmount} ${quest.attributeReward}`,
      quest: completionResult.updatedQuest,
      character: finalCharacter,
      progression: {
        xpEarned: quest.xpReward,
        goldEarned: quest.goldReward,
        attributeEarned: quest.attributeReward,
        attributeAmount: quest.attributeAmount,
        leveledUp: completionResult.xpProgression.leveledUp,
        previousLevel: completionResult.updatedCharacter.level - completionResult.xpProgression.levelsGained,
        newLevel: completionResult.xpProgression.newLevel,
        levelsGained: completionResult.xpProgression.levelsGained,
        nextLevelXP: completionResult.xpProgression.nextLevelXP,
        progressPercentage: completionResult.xpProgression.progressPercentage,
        streak: completionResult.streakResult.newStreak,
        longestStreak: completionResult.streakResult.newLongestStreak,
        streakIncreased: completionResult.streakResult.streakIncreased,
      },
      unlockedAchievements: newAchievements,
    });
  }
}

export default QuestController;
