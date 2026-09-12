import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  compact?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  currentStreak,
  longestStreak,
  compact = false,
}) => {
  const isIgnited = currentStreak > 0;

  if (compact) {
    return (
      <div
        title={`Current Streak: ${currentStreak} days | Longest: ${longestStreak} days`}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-cyber font-bold transition-all ${
          isIgnited
            ? 'bg-amber-500/10 border-amber-500/40 text-cyber-amber shadow-glow-gold'
            : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
        }`}
      >
        <Flame
          className={`w-3.5 h-3.5 ${isIgnited ? 'text-cyber-amber animate-pulse' : 'text-slate-500'}`}
        />
        <span>{currentStreak}d</span>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border backdrop-blur-sm flex items-center justify-between transition-all ${
        isIgnited
          ? 'bg-amber-500/10 border-amber-500/30 shadow-glow-gold'
          : 'bg-citadel/60 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isIgnited
              ? 'bg-gradient-to-tr from-amber-600 to-orange-400 text-white shadow-lg'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Flame className={`w-6 h-6 ${isIgnited ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Activity Streak
          </div>
          <div className="text-lg font-bold font-cyber text-white">
            {currentStreak}{' '}
            <span className="text-xs font-normal text-slate-300">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right pl-3 border-l border-slate-800/80">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">Longest</div>
        <div className="text-sm font-cyber font-bold text-cyber-amber">
          {longestStreak} <span className="text-[10px] text-slate-400">d</span>
        </div>
      </div>
    </div>
  );
};

export default StreakBadge;
