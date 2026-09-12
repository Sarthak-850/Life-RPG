import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, X } from 'lucide-react';
import { useSound } from '../../context/SoundContext.js';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousLevel: number;
  newLevel: number;
  newTitle: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  previousLevel,
  newLevel,
  newTitle,
}) => {
  const { playLevelUp } = useSound();

  useEffect(() => {
    if (isOpen) {
      playLevelUp();

      // Trigger Confetti Burst
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#8B5CF6', '#22D3EE', '#F59E0B', '#FBBF24', '#FFFFFF'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen, playLevelUp]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-gradient-to-b from-citadel via-obsidian to-void border-2 border-cyber-purple shadow-glow-purple p-6 md:p-8 text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyber-purple/30 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy Icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-glow-purple"
            >
              <div className="w-full h-full rounded-2xl bg-citadel flex items-center justify-center">
                <Trophy className="w-10 h-10 text-cyber-gold" />
              </div>
            </motion.div>

            {/* Title */}
            <div className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
              Ascension Achieved
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200 mt-1 font-rpg">
              LEVEL UP!
            </h2>

            {/* Level Transition Pill */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 font-cyber text-lg font-bold">
                LVL {previousLevel}
              </div>
              <ArrowRight className="w-6 h-6 text-cyber-purple animate-pulse" />
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-cyber text-xl font-extrabold shadow-glow-purple">
                LVL {newLevel}
              </div>
            </div>

            {/* New Title Unlocked */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30 mb-6">
              <div className="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyber-amber" />
                <span>Honored Title Bestowed</span>
              </div>
              <div className="text-lg font-bold font-rpg text-cyber-gold mt-1">
                {newTitle}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Your character powers expand. Forge new habits to conquer the realm.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-sm tracking-wider uppercase shadow-glow-purple hover:brightness-110 active:scale-[0.99] transition-all"
            >
              Claim New Power & Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal;
