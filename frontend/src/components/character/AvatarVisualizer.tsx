import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '../../types/index.js';
import { Sword, Shield, Crown, Sparkles } from 'lucide-react';

interface AvatarVisualizerProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  character,
  size = 'md',
  showDetails = true,
}) => {
  const colorSchemes: Record<string, { bg: string; glow: string; text: string; ring: string }> = {
    purple: {
      bg: 'from-purple-900/40 via-citadel to-void',
      glow: 'rgba(139, 92, 246, 0.4)',
      text: 'text-cyber-purple',
      ring: 'border-cyber-purple/50',
    },
    cyan: {
      bg: 'from-cyan-950/40 via-citadel to-void',
      glow: 'rgba(34, 211, 238, 0.4)',
      text: 'text-cyber-cyan',
      ring: 'border-cyber-cyan/50',
    },
    crimson: {
      bg: 'from-rose-950/40 via-citadel to-void',
      glow: 'rgba(239, 68, 68, 0.4)',
      text: 'text-cyber-crimson',
      ring: 'border-cyber-crimson/50',
    },
    amber: {
      bg: 'from-amber-950/40 via-citadel to-void',
      glow: 'rgba(245, 158, 11, 0.4)',
      text: 'text-cyber-amber',
      ring: 'border-cyber-amber/50',
    },
    emerald: {
      bg: 'from-emerald-950/40 via-citadel to-void',
      glow: 'rgba(34, 197, 94, 0.4)',
      text: 'text-cyber-emerald',
      ring: 'border-cyber-emerald/50',
    },
  };

  const currentTheme = colorSchemes[character.avatarColor] || colorSchemes.purple;

  const equipped = character.equippedItems || {
    weapon: null,
    armor: null,
    headwear: null,
    aura: null,
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <div className="flex flex-col items-center">
      {/* Outer Glow & Avatar Frame */}
      <div className="relative group">
        {/* Animated Background Aura if equipped */}
        {equipped.aura && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full opacity-60 blur-md pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${currentTheme.glow} 0%, transparent 70%)`,
            }}
          />
        )}

        <div
          className={`${sizeClasses[size]} relative rounded-2xl bg-gradient-to-b ${currentTheme.bg} border-2 ${currentTheme.ring} shadow-2xl flex items-center justify-center overflow-hidden`}
          style={{ boxShadow: `0 0 25px -5px ${currentTheme.glow}` }}
        >
          {/* Cyber Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />

          {/* Character Silhouette SVG */}
          <svg
            className="w-full h-full p-3 transition-transform duration-500 group-hover:scale-105"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="armorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Aura Rune Ring */}
            {equipped.aura && (
              <circle
                cx="100"
                cy="100"
                r="82"
                stroke="url(#glowGradient)"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                className="animate-spin"
                style={{ animationDuration: '24s' }}
              />
            )}

            {/* Shoulders & Torso */}
            <path
              d="M50 185 C50 145 75 130 100 130 C125 130 150 145 150 185 Z"
              fill={equipped.armor ? 'url(#armorGradient)' : '#1E293B'}
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Chest Core / Crystal */}
            <polygon
              points="100,140 108,155 100,170 92,155"
              fill={equipped.armor ? '#22D3EE' : '#8B5CF6'}
              className="animate-pulse"
            />

            {/* Neck */}
            <rect x="92" y="115" width="16" height="18" rx="4" fill="#0F172A" />

            {/* Head Silhouette */}
            <ellipse cx="100" cy="90" rx="28" ry="32" fill="#0F172A" stroke="#334155" strokeWidth="2" />

            {/* Glowing Cyber Visor / Eyes */}
            <path
              d="M84 88 Q100 92 116 88 Q100 96 84 88"
              fill={equipped.headwear ? '#22D3EE' : '#8B5CF6'}
              filter="drop-shadow(0 0 4px #22D3EE)"
            />

            {/* Headwear Item Render */}
            {equipped.headwear && (
              <path
                d="M75 75 L100 52 L125 75 L115 78 L100 68 L85 78 Z"
                fill="#F59E0B"
                stroke="#FBBF24"
                strokeWidth="1.5"
              />
            )}

            {/* Left Weapon Render */}
            {equipped.weapon && (
              <g transform="translate(140, 60) rotate(25)">
                <line x1="0" y1="0" x2="0" y2="75" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" />
                <line x1="-8" y1="55" x2="8" y2="55" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="72" r="3" fill="#8B5CF6" />
              </g>
            )}
          </svg>

          {/* Level Badge Overlay */}
          <div className="absolute top-2 left-2 bg-citadel/90 border border-cyber-purple/60 px-2 py-0.5 rounded-md text-[11px] font-cyber font-bold text-white shadow-md flex items-center gap-1">
            <span className="text-cyber-purple">LVL</span>
            <span>{character.level}</span>
          </div>

          {/* Equipment Status Icons in Bottom Corner */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {equipped.weapon && (
              <div title={`Equipped Weapon: ${equipped.weapon.name}`} className="p-1 rounded bg-black/60 text-cyber-cyan border border-cyber-cyan/30">
                <Sword className="w-3 h-3" />
              </div>
            )}
            {equipped.armor && (
              <div title={`Equipped Armor: ${equipped.armor.name}`} className="p-1 rounded bg-black/60 text-cyber-purple border border-cyber-purple/30">
                <Shield className="w-3 h-3" />
              </div>
            )}
            {equipped.headwear && (
              <div title={`Equipped Headwear: ${equipped.headwear.name}`} className="p-1 rounded bg-black/60 text-cyber-gold border border-cyber-gold/30">
                <Crown className="w-3 h-3" />
              </div>
            )}
            {equipped.aura && (
              <div title={`Equipped Aura: ${equipped.aura.name}`} className="p-1 rounded bg-black/60 text-cyber-emerald border border-cyber-emerald/30">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 text-center">
          <div className="text-base font-bold font-rpg tracking-wide text-white">
            {character.title}
          </div>
          <div className="text-xs text-text-secondary mt-0.5">
            Level {character.level} Champion
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarVisualizer;
