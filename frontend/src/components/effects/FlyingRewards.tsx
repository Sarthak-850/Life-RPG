import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, ArrowUp } from 'lucide-react';
import { CharacterAttribute } from '../../types/index.js';

export interface RewardBurst {
  id: string;
  xp: number;
  gold: number;
  attribute: CharacterAttribute;
  attributeAmount: number;
}

interface FlyingRewardsProps {
  burst: RewardBurst | null;
  onComplete: () => void;
}

export const FlyingRewards: React.FC<FlyingRewardsProps> = ({ burst, onComplete }) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {burst && (
        <div className="fixed top-24 right-8 z-50 pointer-events-none flex flex-col items-end gap-2">
          {/* XP Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-citadel/95 border border-cyber-purple/80 text-cyber-purple font-cyber font-bold text-sm shadow-glow-purple"
          >
            <Sparkles className="w-4 h-4" />
            <span>+{burst.xp} XP</span>
          </motion.div>

          {/* Gold Banner */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-citadel/95 border border-cyber-amber/80 text-cyber-gold font-cyber font-bold text-sm shadow-glow-gold"
          >
            <Coins className="w-4 h-4" />
            <span>+{burst.gold} Gold</span>
          </motion.div>

          {/* Attribute Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-citadel/95 border border-cyber-cyan/80 text-cyber-cyan font-cyber font-bold text-sm shadow-glow-cyan"
          >
            <ArrowUp className="w-4 h-4" />
            <span>+{burst.attributeAmount} {burst.attribute}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FlyingRewards;
