import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import AvatarVisualizer from '../components/character/AvatarVisualizer.js';
import XPProgressBar from '../components/character/XPProgressBar.js';
import AttributeBars from '../components/character/AttributeBars.js';
import StreakBadge from '../components/character/StreakBadge.js';
import {
  Sword,
  Shield,
  Crown,
  Sparkles,
  Palette,
  ArrowRight,
} from 'lucide-react';

interface CharacterPageProps {
  onNavigate: (page: string) => void;
}

export const CharacterPage: React.FC<CharacterPageProps> = ({ onNavigate }) => {
  const { character, updateCharacter } = useAuth();
  const { playClick } = useSound();
  const toast = useToast();

  const [selectedColor, setSelectedColor] = useState(character?.avatarColor || 'purple');
  const [isUpdatingColor, setIsUpdatingColor] = useState(false);

  if (!character) return null;

  const colorOptions = [
    { id: 'purple', name: 'Cyber Violet', class: 'bg-cyber-purple' },
    { id: 'cyan', name: 'Neon Cyan', class: 'bg-cyber-cyan' },
    { id: 'crimson', name: 'Blood Crimson', class: 'bg-rose-600' },
    { id: 'amber', name: 'Solar Amber', class: 'bg-amber-500' },
    { id: 'emerald', name: 'Jade Emerald', class: 'bg-emerald-500' },
  ];

  const handleColorChange = async (colorId: string) => {
    playClick();
    setSelectedColor(colorId);
    setIsUpdatingColor(true);
    try {
      const updated = await api.updateAppearance(colorId);
      updateCharacter(updated);
      toast.success('Hero aura re-aligned!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update appearance.');
    } finally {
      setIsUpdatingColor(false);
    }
  };

  const equipped = character.equippedItems || {
    weapon: null,
    armor: null,
    headwear: null,
    aura: null,
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
          Player Profile & Armament
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
          Hero Sanctum
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Inspect your champion attributes, equipped gear, and customize your aura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Appearance (1 col) */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-citadel/80 border border-cyber-purple/40 shadow-glow-purple/20 p-6 backdrop-blur-xl flex flex-col items-center text-center">
            <AvatarVisualizer character={character} size="lg" showDetails={false} />

            <div className="mt-4">
              <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
                Level {character.level}
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-rpg text-white mt-0.5">
                {character.title}
              </h2>
            </div>

            {/* Aura Customizer */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 w-full">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 font-semibold mb-3">
                <Palette className="w-4 h-4 text-cyber-purple" />
                <span>Select Aura Core Resonance</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    title={c.name}
                    onClick={() => handleColorChange(c.id)}
                    disabled={isUpdatingColor}
                    className={`w-7 h-7 rounded-full ${c.class} transition-all ${
                      selectedColor === c.id
                        ? 'ring-4 ring-white/50 scale-110 shadow-lg'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Activity Streak Details */}
          <StreakBadge
            currentStreak={character.currentStreak}
            longestStreak={character.longestStreak}
          />
        </div>

        {/* Right Column: Equipped Gear & Stats (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP Progression Card */}
          <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md">
            <h3 className="text-sm font-cyber font-bold uppercase text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-purple" />
              <span>Current Progression Tier</span>
            </h3>
            <XPProgressBar
              currentXP={character.xp}
              level={character.level}
              nextLevelXP={character.nextLevelXP}
              progressPercentage={character.progressPercentage}
            />
          </div>

          {/* Equipped Gear Slots */}
          <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-cyber font-bold uppercase text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyber-cyan" />
                <span>Active Equipment</span>
              </h3>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs text-cyber-cyan hover:underline font-medium flex items-center gap-1"
              >
                <span>Manage Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Weapon */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-black/40 flex items-center justify-center text-cyber-cyan mb-2">
                  <Sword className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Weapon</div>
                <div className="text-xs font-bold text-white mt-0.5 truncate">
                  {equipped.weapon ? equipped.weapon.name : 'Unarmed'}
                </div>
                {equipped.weapon?.statBonus && (
                  <div className="text-[10px] text-cyber-cyan mt-1">{equipped.weapon.statBonus}</div>
                )}
              </div>

              {/* Armor */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-black/40 flex items-center justify-center text-cyber-purple mb-2">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Armor</div>
                <div className="text-xs font-bold text-white mt-0.5 truncate">
                  {equipped.armor ? equipped.armor.name : 'Cloth'}
                </div>
                {equipped.armor?.statBonus && (
                  <div className="text-[10px] text-cyber-purple mt-1">{equipped.armor.statBonus}</div>
                )}
              </div>

              {/* Headwear */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-black/40 flex items-center justify-center text-cyber-gold mb-2">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Headgear</div>
                <div className="text-xs font-bold text-white mt-0.5 truncate">
                  {equipped.headwear ? equipped.headwear.name : 'Bare'}
                </div>
                {equipped.headwear?.statBonus && (
                  <div className="text-[10px] text-cyber-gold mt-1">{equipped.headwear.statBonus}</div>
                )}
              </div>

              {/* Aura */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-black/40 flex items-center justify-center text-cyber-emerald mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Aura Relic</div>
                <div className="text-xs font-bold text-white mt-0.5 truncate">
                  {equipped.aura ? equipped.aura.name : 'Dormant'}
                </div>
                {equipped.aura?.statBonus && (
                  <div className="text-[10px] text-cyber-emerald mt-1">{equipped.aura.statBonus}</div>
                )}
              </div>
            </div>
          </div>

          {/* 5 Core Attributes Bars */}
          <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md">
            <h3 className="text-sm font-cyber font-bold uppercase text-slate-300 mb-4">
              Attribute Breakdown
            </h3>
            <AttributeBars character={character} />
          </div>

          {/* Lifetime Career Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-xl font-bold font-cyber text-cyber-purple">
                {character.stats?.totalCompletedQuests ?? 0}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                Quests Conquered
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-xl font-bold font-cyber text-cyber-amber">
                {character.gold}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                Gold In Purse
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-xl font-bold font-cyber text-cyber-cyan">
                {character.longestStreak} d
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                Peak Streak
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-xl font-bold font-cyber text-cyber-emerald">
                {character.stats?.unlockedAchievementsCount ?? 0}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                Trophies Claimed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
