export type QuestCategory =
  | 'Coding'
  | 'Study'
  | 'Fitness'
  | 'Health'
  | 'Reading'
  | 'Work'
  | 'Personal'
  | 'Mindfulness'
  | 'Other';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

export type CharacterAttribute =
  | 'Strength'
  | 'Intellect'
  | 'Agility'
  | 'Wisdom'
  | 'Discipline';

export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'Weapon' | 'Armor' | 'Headwear' | 'Aura' | 'Relic' | 'Theme';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: ItemRarity;
  type: ItemType;
  icon: string;
  statBonus?: string | null;
  isOwned?: boolean;
  isEquipped?: boolean;
}

export interface Character {
  id: string;
  userId: string;
  title: string;
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  agility: number;
  wisdom: number;
  discipline: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string | null;
  avatarColor: string;
  equippedWeaponId?: string | null;
  equippedArmorId?: string | null;
  equippedHeadId?: string | null;
  equippedAuraId?: string | null;
  nextLevelXP?: number;
  progressPercentage?: number;
  equippedItems?: {
    weapon: Item | null;
    armor: Item | null;
    headwear: Item | null;
    aura: Item | null;
  };
  stats?: {
    totalCompletedQuests: number;
    totalInventoryCount: number;
    unlockedAchievementsCount: number;
  };
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  attributeReward: CharacterAttribute;
  attributeAmount: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  isEquipped: boolean;
  purchasedAt: string;
  item: Item;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  requirementValue: number;
  xpReward: number;
  goldReward: number;
  icon: string;
  isUnlocked?: boolean;
  unlockedAt?: string | null;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'QUEST_COMPLETE' | 'LEVEL_UP' | 'ITEM_PURCHASED' | 'ITEM_EQUIPPED' | 'ACHIEVEMENT_UNLOCKED' | 'STREAK_MILESTONE';
  title: string;
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface QuestCompletionResponse {
  success: boolean;
  message: string;
  quest: Quest;
  character: Character;
  progression: {
    xpEarned: number;
    goldEarned: number;
    attributeEarned: CharacterAttribute;
    attributeAmount: number;
    leveledUp: boolean;
    previousLevel: number;
    newLevel: number;
    levelsGained: number;
    nextLevelXP: number;
    progressPercentage: number;
    streak: number;
    longestStreak: number;
    streakIncreased: boolean;
  };
  unlockedAchievements: Achievement[];
}
