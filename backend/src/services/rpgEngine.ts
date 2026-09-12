import { QuestCategory, QuestDifficulty, CharacterAttribute, RewardCalculation } from '../types/index.js';

export class RPGEngine {
  /**
   * Calculates XP required to advance from current level to the next level.
   * Non-linear formula: floor(100 * level^1.5)
   */
  static getRequiredXP(level: number): number {
    return Math.floor(100 * Math.pow(Math.max(1, level), 1.5));
  }

  /**
   * Calculates progress percentage towards the next level (0 to 100).
   */
  static getProgressPercentage(currentXP: number, level: number): number {
    const required = this.getRequiredXP(level);
    return Math.min(100, Math.max(0, Math.floor((currentXP / required) * 100)));
  }

  /**
   * Maps a quest category to its associated character attribute.
   */
  static mapCategoryToAttribute(category: QuestCategory): CharacterAttribute {
    switch (category) {
      case 'Coding':
      case 'Study':
        return 'Intellect';
      case 'Fitness':
        return 'Strength';
      case 'Health':
        return 'Agility';
      case 'Reading':
      case 'Mindfulness':
        return 'Wisdom';
      case 'Work':
      case 'Personal':
      case 'Other':
      default:
        return 'Discipline';
    }
  }

  /**
   * Authoritatively computes rewards for a quest based on category and difficulty.
   */
  static calculateQuestRewards(
    category: QuestCategory,
    difficulty: QuestDifficulty
  ): RewardCalculation {
    const attributeReward = this.mapCategoryToAttribute(category);

    let xpReward = 50;
    let goldReward = 20;
    let attributeAmount = 2;

    switch (difficulty) {
      case 'Easy':
        xpReward = 50;
        goldReward = 20;
        attributeAmount = 2;
        break;
      case 'Medium':
        xpReward = 100;
        goldReward = 40;
        attributeAmount = 4;
        break;
      case 'Hard':
        xpReward = 175;
        goldReward = 70;
        attributeAmount = 7;
        break;
      case 'Epic':
        xpReward = 300;
        goldReward = 120;
        attributeAmount = 12;
        break;
    }

    return {
      xpReward,
      goldReward,
      attributeReward,
      attributeAmount,
    };
  }

  /**
   * Computes progression state given current level, current XP, and newly gained XP.
   * Accurately supports multiple level-ups with carryover XP.
   */
  static processXPGain(
    currentLevel: number,
    currentXP: number,
    gainedXP: number
  ): {
    newLevel: number;
    newXP: number;
    leveledUp: boolean;
    levelsGained: number;
    nextLevelXP: number;
    progressPercentage: number;
  } {
    let level = currentLevel;
    let xp = currentXP + gainedXP;
    let levelsGained = 0;

    let required = this.getRequiredXP(level);
    while (xp >= required) {
      xp -= required;
      level += 1;
      levelsGained += 1;
      required = this.getRequiredXP(level);
    }

    return {
      newLevel: level,
      newXP: xp,
      leveledUp: levelsGained > 0,
      levelsGained,
      nextLevelXP: required,
      progressPercentage: this.getProgressPercentage(xp, level),
    };
  }

  /**
   * Dynamic title assignment based on level.
   */
  static getTitleForLevel(level: number): string {
    if (level >= 25) return 'Grandmaster Sovereign';
    if (level >= 20) return 'Master of Realms';
    if (level >= 15) return 'Shadow Weaver';
    if (level >= 10) return 'Cyber Vanguard';
    if (level >= 5) return 'Apprentice of Destiny';
    return 'Novice Adventurer';
  }
}

export default RPGEngine;
