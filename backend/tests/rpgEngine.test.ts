import { describe, it, expect } from 'vitest';
import RPGEngine from '../src/services/rpgEngine.js';

describe('RPGEngine', () => {
  it('calculates non-linear XP thresholds correctly', () => {
    // floor(100 * level^1.5)
    expect(RPGEngine.getRequiredXP(1)).toBe(100);
    expect(RPGEngine.getRequiredXP(2)).toBe(282);
    expect(RPGEngine.getRequiredXP(3)).toBe(519);
    expect(RPGEngine.getRequiredXP(4)).toBe(800);
    expect(RPGEngine.getRequiredXP(5)).toBe(1118);
  });

  it('calculates progress percentage correctly', () => {
    expect(RPGEngine.getProgressPercentage(50, 1)).toBe(50);
    expect(RPGEngine.getProgressPercentage(0, 1)).toBe(0);
    expect(RPGEngine.getProgressPercentage(100, 1)).toBe(100);
  });

  it('maps categories to attributes properly', () => {
    expect(RPGEngine.mapCategoryToAttribute('Coding')).toBe('Intellect');
    expect(RPGEngine.mapCategoryToAttribute('Study')).toBe('Intellect');
    expect(RPGEngine.mapCategoryToAttribute('Fitness')).toBe('Strength');
    expect(RPGEngine.mapCategoryToAttribute('Health')).toBe('Agility');
    expect(RPGEngine.mapCategoryToAttribute('Reading')).toBe('Wisdom');
    expect(RPGEngine.mapCategoryToAttribute('Mindfulness')).toBe('Wisdom');
    expect(RPGEngine.mapCategoryToAttribute('Work')).toBe('Discipline');
  });

  it('calculates quest rewards by difficulty', () => {
    const easy = RPGEngine.calculateQuestRewards('Fitness', 'Easy');
    expect(easy.xpReward).toBe(50);
    expect(easy.goldReward).toBe(20);
    expect(easy.attributeReward).toBe('Strength');
    expect(easy.attributeAmount).toBe(2);

    const epic = RPGEngine.calculateQuestRewards('Coding', 'Epic');
    expect(epic.xpReward).toBe(300);
    expect(epic.goldReward).toBe(120);
    expect(epic.attributeReward).toBe('Intellect');
    expect(epic.attributeAmount).toBe(12);
  });

  it('handles standard XP gain without level up', () => {
    const result = RPGEngine.processXPGain(1, 10, 50);
    expect(result.newLevel).toBe(1);
    expect(result.newXP).toBe(60);
    expect(result.leveledUp).toBe(false);
    expect(result.levelsGained).toBe(0);
  });

  it('handles single level up with carryover XP', () => {
    // Level 1 requires 100 XP. Current: 80 XP. Gain: 50 XP. Total: 130 XP.
    // Level becomes 2. Carryover: 130 - 100 = 30 XP.
    const result = RPGEngine.processXPGain(1, 80, 50);
    expect(result.newLevel).toBe(2);
    expect(result.newXP).toBe(30);
    expect(result.leveledUp).toBe(true);
    expect(result.levelsGained).toBe(1);
  });

  it('handles multiple level ups cleanly', () => {
    // Level 1 requires 100 XP, Level 2 requires 282 XP (total 382)
    // Starting Level 1 with 0 XP. Gain 400 XP.
    // Level 1 -> 2 (uses 100, 300 remaining)
    // Level 2 -> 3 (uses 282, 18 remaining)
    const result = RPGEngine.processXPGain(1, 0, 400);
    expect(result.newLevel).toBe(3);
    expect(result.newXP).toBe(18);
    expect(result.leveledUp).toBe(true);
    expect(result.levelsGained).toBe(2);
  });
});
