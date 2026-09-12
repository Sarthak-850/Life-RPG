import React from 'react';
import { motion } from 'framer-motion';
import { Quest } from '../../types/index.js';
import {
  Check,
  Coins,
  Sparkles,
  ArrowUp,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onEdit?: (quest: Quest) => void;
  onDelete?: (questId: string) => void;
  isCompleting?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
  isCompleting = false,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const difficultyStyles = {
    Easy: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    Medium: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    Hard: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    Epic: 'border-amber-500/40 text-amber-400 bg-amber-950/20 shadow-glow-gold/20',
  };

  const categoryIcons: Record<string, string> = {
    Coding: '💻',
    Study: '📚',
    Fitness: '💪',
    Health: '🥗',
    Reading: '📖',
    Work: '💼',
    Personal: '🎯',
    Mindfulness: '🧘',
    Other: '⚡',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-2xl p-4 md:p-5 border transition-all duration-300 relative group overflow-hidden ${
        quest.isCompleted
          ? 'bg-slate-900/40 border-slate-800 opacity-65'
          : 'bg-citadel/80 border-slate-800 hover:border-cyber-purple/50 hover:shadow-glow-purple/20 backdrop-blur-md'
      }`}
    >
      {/* Top Bar: Category, Difficulty, and Options */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1">
            <span>{categoryIcons[quest.category] || '⚡'}</span>
            <span>{quest.category}</span>
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full border text-xs font-cyber font-semibold ${
              difficultyStyles[quest.difficulty] || difficultyStyles.Medium
            }`}
          >
            {quest.difficulty}
          </span>
        </div>

        {/* Action Menu (only for active quests) */}
        {!quest.isCompleted && (onEdit || onDelete) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Quest options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-obsidian border border-slate-700 shadow-xl py-1 text-xs font-medium">
                {onEdit && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(quest);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Quest</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(quest.id);
                    }}
                    className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Banish Quest</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quest Title & Description */}
      <div className="mb-4">
        <h3
          className={`text-base md:text-lg font-bold font-rpg tracking-wide ${
            quest.isCompleted ? 'text-slate-400 line-through' : 'text-white'
          }`}
        >
          {quest.title}
        </h3>
        {quest.description && (
          <p className="text-xs md:text-sm text-text-secondary mt-1 line-clamp-2">
            {quest.description}
          </p>
        )}
      </div>

      {/* Reward Badges Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs font-cyber">
          <span className="flex items-center gap-1 text-cyber-purple font-semibold bg-purple-950/30 px-2 py-1 rounded-lg border border-purple-900/40">
            <Sparkles className="w-3 h-3" />
            +{quest.xpReward} XP
          </span>
          <span className="flex items-center gap-1 text-cyber-gold font-semibold bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-900/40">
            <Coins className="w-3 h-3" />
            +{quest.goldReward} G
          </span>
          <span className="flex items-center gap-1 text-cyber-cyan font-semibold bg-cyan-950/30 px-2 py-1 rounded-lg border border-cyan-900/40">
            <ArrowUp className="w-3 h-3" />
            +{quest.attributeAmount} {quest.attributeReward}
          </span>
        </div>

        {/* Completion Action */}
        <div>
          {quest.isCompleted ? (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-cyber font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Conquered</span>
            </div>
          ) : (
            <button
              onClick={() => onComplete(quest.id)}
              disabled={isCompleting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 text-white font-cyber font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-glow-purple/40 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isCompleting ? 'Conquering...' : 'Complete'}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestCard;
