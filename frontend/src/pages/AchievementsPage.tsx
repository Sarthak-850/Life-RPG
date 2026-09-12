import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { Achievement } from '../types/index.js';
import {
  Trophy,
  Award,
  Crown,
  Dumbbell,
  BookOpen,
  Flame,
  Zap,
  Coins,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SkeletonCard } from '../components/common/Skeleton.js';

export const AchievementsPage: React.FC = () => {
  const toast = useToast();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.getAchievements();
      setAchievements(res.achievements);
      setUnlockedCount(res.unlockedCount);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Coins':
        return <Coins className="w-6 h-6" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  const percentage = achievements.length > 0
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
          Hall of Legends
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
          Achievements Codex
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Milestones, feats of discipline, and glory unlocked throughout your journey.
        </p>
      </div>

      {/* Completion Banner */}
      <div className="p-6 rounded-2xl bg-citadel/80 border border-cyber-purple/40 shadow-glow-purple/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-cyber-amber shadow-glow-gold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Trophies Claimed</div>
              <div className="text-xl font-cyber font-extrabold text-white">
                {unlockedCount} / {achievements.length}{' '}
                <span className="text-xs font-normal text-slate-400">({percentage}%)</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full sm:w-64 h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = ach.isUnlocked;

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-citadel/80 border-cyber-amber/60 shadow-glow-gold/20'
                    : 'bg-citadel/40 border-slate-800/80 opacity-55'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        isUnlocked
                          ? 'bg-amber-500/20 border-amber-500/40 text-cyber-gold shadow-glow-gold/30'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {isUnlocked ? getIcon(ach.icon) : <Lock className="w-5 h-5" />}
                    </div>

                    <span className="text-[10px] uppercase font-cyber font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {ach.category}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold font-rpg tracking-wide ${
                      isUnlocked ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {ach.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-cyber">
                  <div className="flex items-center gap-2">
                    <span className="text-cyber-purple font-semibold">+{ach.xpReward} XP</span>
                    <span className="text-cyber-gold font-semibold">+{ach.goldReward} G</span>
                  </div>

                  {isUnlocked && ach.unlockedAt && (
                    <span className="text-[10px] text-emerald-400 font-sans">
                      ✓ Claimed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
