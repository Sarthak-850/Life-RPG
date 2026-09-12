import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coins, ArrowUp } from 'lucide-react';
import { Quest, QuestCategory, QuestDifficulty, CharacterAttribute } from '../../types/index.js';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
  }) => Promise<void>;
  initialQuest?: Quest | null;
  isSubmitting?: boolean;
}

const CATEGORIES: { label: string; value: QuestCategory; attribute: CharacterAttribute; icon: string }[] = [
  { label: 'Coding', value: 'Coding', attribute: 'Intellect', icon: '💻' },
  { label: 'Study & Academics', value: 'Study', attribute: 'Intellect', icon: '📚' },
  { label: 'Fitness & Workout', value: 'Fitness', attribute: 'Strength', icon: '💪' },
  { label: 'Health & Nutrition', value: 'Health', attribute: 'Agility', icon: '🥗' },
  { label: 'Reading & Lore', value: 'Reading', attribute: 'Wisdom', icon: '📖' },
  { label: 'Mindfulness & Meditation', value: 'Mindfulness', attribute: 'Wisdom', icon: '🧘' },
  { label: 'Career & Work', value: 'Work', attribute: 'Discipline', icon: '💼' },
  { label: 'Personal & Habits', value: 'Personal', attribute: 'Discipline', icon: '🎯' },
  { label: 'Other Feats', value: 'Other', attribute: 'Discipline', icon: '⚡' },
];

const DIFFICULTIES: {
  label: string;
  value: QuestDifficulty;
  xp: number;
  gold: number;
  attrAmount: number;
  border: string;
  badge: string;
}[] = [
  {
    label: 'Easy',
    value: 'Easy',
    xp: 50,
    gold: 20,
    attrAmount: 2,
    border: 'border-emerald-500/40 text-emerald-400',
    badge: 'Quick Feat',
  },
  {
    label: 'Medium',
    value: 'Medium',
    xp: 100,
    gold: 40,
    attrAmount: 4,
    border: 'border-cyan-500/40 text-cyan-400',
    badge: 'Standard Mission',
  },
  {
    label: 'Hard',
    value: 'Hard',
    xp: 175,
    gold: 70,
    attrAmount: 7,
    border: 'border-purple-500/40 text-purple-400',
    badge: 'Arduous Trial',
  },
  {
    label: 'Epic',
    value: 'Epic',
    xp: 300,
    gold: 120,
    attrAmount: 12,
    border: 'border-amber-500/40 text-amber-400 shadow-glow-gold/30',
    badge: 'Legendary Raid',
  },
];

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuest,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Coding');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDescription(initialQuest.description || '');
      setCategory(initialQuest.category);
      setDifficulty(initialQuest.difficulty);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Coding');
      setDifficulty('Medium');
    }
    setError(null);
  }, [initialQuest, isOpen]);

  if (!isOpen) return null;

  const currentDiff = DIFFICULTIES.find((d) => d.value === difficulty) || DIFFICULTIES[1];
  const currentCat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quest title is required.');
      return;
    }
    try {
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        difficulty,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record quest.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-xl rounded-2xl bg-citadel border border-cyber-purple/50 shadow-glow-purple/20 p-6 md:p-7 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
                {initialQuest ? 'Modify Record' : 'Quest Ledger'}
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-rpg text-white">
                {initialQuest ? 'Edit Quest' : 'Forge New Quest'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Quest Objective <span className="text-cyber-crimson">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Rust Concurrency for 2 hours"
                maxLength={120}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Quest Notes & Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline subtasks, targets, or reference links..."
                rows={2}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple text-sm resize-none"
              />
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Domain & Attribute
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      category === cat.value
                        ? 'bg-purple-950/40 border-cyber-purple text-white shadow-glow-purple/20'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm">{cat.icon}</div>
                    <div className="text-xs font-semibold mt-1 truncate">{cat.label}</div>
                    <div className="text-[10px] text-cyber-cyan">+{cat.attribute}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setDifficulty(diff.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      difficulty === diff.value
                        ? `bg-slate-800 border-cyber-purple text-white ${diff.border}`
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-cyber font-bold">{diff.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{diff.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Reward Calculation Preview */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-cyber">
              <span className="text-slate-400 uppercase tracking-wider">Reward Bounty:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyber-purple font-bold">
                  <Sparkles className="w-3.5 h-3.5" />+{currentDiff.xp} XP
                </span>
                <span className="flex items-center gap-1 text-cyber-gold font-bold">
                  <Coins className="w-3.5 h-3.5" />+{currentDiff.gold} Gold
                </span>
                <span className="flex items-center gap-1 text-cyber-cyan font-bold">
                  <ArrowUp className="w-3.5 h-3.5" />+{currentDiff.attrAmount} {currentCat.attribute}
                </span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-xs tracking-wider uppercase shadow-glow-purple hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Inscribing...' : initialQuest ? 'Save Changes' : 'Forge Quest'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuestModal;
