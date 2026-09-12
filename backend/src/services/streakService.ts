export class StreakService {
  /**
   * Helper to normalize a date to midnight UTC string 'YYYY-MM-DD'
   */
  static getUTCDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculates the difference in calendar days between two dates.
   */
  static getDayDifference(currentDate: Date, previousDate: Date): number {
    const d1 = new Date(this.getUTCDateString(currentDate)).getTime();
    const d2 = new Date(this.getUTCDateString(previousDate)).getTime();
    const diffMs = d1 - d2;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Evaluates updated streak values based on last activity date and current time.
   */
  static calculateStreak(
    currentStreak: number,
    longestStreak: number,
    lastActivityDate: Date | null,
    now: Date = new Date()
  ): {
    newStreak: number;
    newLongestStreak: number;
    streakIncreased: boolean;
    isSameDay: boolean;
  } {
    if (!lastActivityDate) {
      // First activity ever
      return {
        newStreak: 1,
        newLongestStreak: Math.max(1, longestStreak),
        streakIncreased: true,
        isSameDay: false,
      };
    }

    const dayDiff = this.getDayDifference(now, lastActivityDate);

    if (dayDiff === 0) {
      // Same calendar day completion - streak unchanged
      return {
        newStreak: currentStreak,
        newLongestStreak: longestStreak,
        streakIncreased: false,
        isSameDay: true,
      };
    } else if (dayDiff === 1) {
      // Exactly 1 calendar day later - increment consecutive streak
      const updatedStreak = currentStreak + 1;
      return {
        newStreak: updatedStreak,
        newLongestStreak: Math.max(updatedStreak, longestStreak),
        streakIncreased: true,
        isSameDay: false,
      };
    } else {
      // More than 1 day missed - streak resets to 1
      return {
        newStreak: 1,
        newLongestStreak: longestStreak,
        streakIncreased: currentStreak !== 1,
        isSameDay: false,
      };
    }
  }
}

export default StreakService;
