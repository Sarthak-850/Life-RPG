import { Request } from 'express';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

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

export interface RewardCalculation {
  xpReward: number;
  goldReward: number;
  attributeReward: CharacterAttribute;
  attributeAmount: number;
}
