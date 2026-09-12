import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XPProgressBarProps {
  currentXP: number;
  level: number;
  nextLevelXP?: number;
  progressPercentage?: number;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  level,
  nextLevelXP,
  progressPercentage,
}) => {
  // Default formula if not passed
  const calculatedNextXP = nextLevelXP || Math.floor(100 * Math.pow(level, 1.5));
  const pct = progressPercentage !== undefined
    ? progressPercentage
    : Math.min(100, Math.round((currentXP / calculatedNextXP) * 100));

  const remainingXP = Math.max(0, calculatedNextXP - currentXP);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyber-purple" />
          <span className="uppercase tracking-wider font-semibold text-slate-200">
            Experience to Level {level + 1}
          </span>
        </div>
        <div className="font-cyber text-slate-300">
          <span className="text-white font-bold">{currentXP}</span> /{' '}
          <span className="text-slate-400">{calculatedNextXP} XP</span>{' '}
          <span className="text-cyber-cyan font-semibold ml-1">({pct}%)</span>
        </div>
      </div>

      {/* Main XP Bar */}
      <div className="relative w-full h-4 rounded-full bg-slate-900 border border-slate-700/60 overflow-hidden shadow-inner p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-cyber-purple via-indigo-500 to-cyber-cyan relative animate-shimmer"
        >
          {/* Glowing pulse tip */}
          {pct > 0 && (
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[2px] opacity-80" />
          )}
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
        <span>Level {level}</span>
        <span>
          <span className="text-cyber-cyan font-medium">{remainingXP} XP</span> required for next ascension
        </span>
      </div>
    </div>
  );
};

export default XPProgressBar;
