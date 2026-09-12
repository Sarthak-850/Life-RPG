import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '../../types/index.js';
import { Dumbbell, Brain, Zap, BookOpen, Flame } from 'lucide-react';

interface AttributeBarsProps {
  character: Character;
}

export const AttributeBars: React.FC<AttributeBarsProps> = ({ character }) => {
  const attributes = [
    {
      name: 'Strength',
      value: character.strength,
      icon: Dumbbell,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      description: 'Forged through Fitness & Physical Training',
    },
    {
      name: 'Intellect',
      value: character.intellect,
      icon: Brain,
      color: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      description: 'Honed through Coding, Logic & Academic Study',
    },
    {
      name: 'Agility',
      value: character.agility,
      icon: Zap,
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      description: 'Developed through Health, Reflexes & Running',
    },
    {
      name: 'Wisdom',
      value: character.wisdom,
      icon: BookOpen,
      color: 'from-purple-400 to-violet-600',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      description: 'Cultivated through Reading, Reflection & Meditation',
    },
    {
      name: 'Discipline',
      value: character.discipline,
      icon: Flame,
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      description: 'Built through Work, Consistency & Habit Mastery',
    },
  ];

  // Benchmark maximum for visual percentage relative to highest attribute
  const maxValue = Math.max(...attributes.map((a) => a.value), 30);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {attributes.map((attr) => {
        const Icon = attr.icon;
        const fillPercentage = Math.min(100, Math.round((attr.value / maxValue) * 100));

        return (
          <div
            key={attr.name}
            className={`p-3.5 rounded-xl bg-citadel/60 border ${attr.borderColor} backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-black/40 ${attr.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                  {attr.name}
                </span>
              </div>
              <span className={`text-base font-bold font-cyber ${attr.textColor}`}>
                {attr.value}
              </span>
            </div>

            {/* Stat Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
              />
            </div>

            <p className="text-[10px] text-slate-400 mt-2 truncate group-hover:text-slate-200 transition-colors">
              {attr.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeBars;
