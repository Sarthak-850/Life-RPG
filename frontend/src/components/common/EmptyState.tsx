import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-citadel/40 border border-dashed border-slate-800 my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-cyber-purple mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold font-rpg text-white tracking-wide">{title}</h4>
      <p className="text-xs md:text-sm text-text-secondary max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-cyber font-bold text-xs tracking-wider uppercase shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
