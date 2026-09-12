import { describe, it, expect } from 'vitest';
import StreakService from '../services/streakService.js';

describe('StreakService', () => {
  it('initializes streak to 1 on first activity ever', () => {
    const result = StreakService.calculateStreak(0, 0, null, new Date('2026-09-12T10:00:00Z'));
    expect(result.newStreak).toBe(1);
    expect(result.newLongestStreak).toBe(1);
    expect(result.streakIncreased).toBe(true);
    expect(result.isSameDay).toBe(false);
  });

  it('keeps streak unchanged on same day completions', () => {
    const lastActivity = new Date('2026-09-12T08:00:00Z');
    const now = new Date('2026-09-12T14:30:00Z');
    const result = StreakService.calculateStreak(3, 5, lastActivity, now);
    expect(result.newStreak).toBe(3);
    expect(result.newLongestStreak).toBe(5);
    expect(result.streakIncreased).toBe(false);
    expect(result.isSameDay).toBe(true);
  });

  it('increments streak on consecutive calendar day', () => {
    const lastActivity = new Date('2026-09-11T20:00:00Z');
    const now = new Date('2026-09-12T09:00:00Z');
    const result = StreakService.calculateStreak(3, 3, lastActivity, now);
    expect(result.newStreak).toBe(4);
    expect(result.newLongestStreak).toBe(4);
    expect(result.streakIncreased).toBe(true);
    expect(result.isSameDay).toBe(false);
  });

  it('resets streak to 1 when a day is skipped', () => {
    const lastActivity = new Date('2026-09-08T12:00:00Z');
    const now = new Date('2026-09-12T12:00:00Z'); // 4 days gap
    const result = StreakService.calculateStreak(5, 10, lastActivity, now);
    expect(result.newStreak).toBe(1);
    expect(result.newLongestStreak).toBe(10); // longest streak preserved
    expect(result.isSameDay).toBe(false);
  });
});
