import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { Quest, ActivityLog } from '../types/index.js';
import AvatarVisualizer from '../components/character/AvatarVisualizer.js';
import XPProgressBar from '../components/character/XPProgressBar.js';
import AttributeBars from '../components/character/AttributeBars.js';
import StreakBadge from '../components/character/StreakBadge.js';
import QuestCard from '../components/quests/QuestCard.js';
import QuestModal from '../components/quests/QuestModal.js';
import CelebrationModal from '../components/effects/CelebrationModal.js';
import FlyingRewards, { RewardBurst } from '../components/effects/FlyingRewards.js';
import EmptyState from '../components/common/EmptyState.js';
import { SkeletonDashboard } from '../components/common/Skeleton.js';
import {
  Plus,
  ShoppingBag,
  Sparkles,
  History,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { character, refreshCharacter } = useAuth();
  const { playClick, playQuestComplete } = useSound();
  const toast = useToast();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Celebration & Reward States
  const [rewardBurst, setRewardBurst] = useState<RewardBurst | null>(null);
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    previousLevel: number;
    newLevel: number;
    newTitle: string;
  }>({
    isOpen: false,
    previousLevel: 1,
    newLevel: 1,
    newTitle: '',
  });

  const fetchData = async () => {
    try {
      const [fetchedQuests, historyRes] = await Promise.all([
        api.getQuests({ isCompleted: false }),
        api.getHistory(1, 5),
        refreshCharacter(),
      ]);
      setQuests(fetchedQuests);
      setRecentLogs(historyRes.logs);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQuest = async (data: {
    title: string;
    description?: string;
    category: any;
    difficulty: any;
  }) => {
    const created = await api.createQuest(data);
    setQuests((prev) => [created, ...prev]);
    toast.success('Quest forged in your ledger!');
    fetchData();
  };

  const handleCompleteQuest = async (questId: string) => {
    setCompletingId(questId);
    try {
      const res = await api.completeQuest(questId);
      playQuestComplete();

      // Trigger floating numbers
      setRewardBurst({
        id: Math.random().toString(),
        xp: res.progression.xpEarned,
        gold: res.progression.goldEarned,
        attribute: res.progression.attributeEarned,
        attributeAmount: res.progression.attributeAmount,
      });

      // Update quests list
      setQuests((prev) => prev.filter((q) => q.id !== questId));

      // Check level up modal
      if (res.progression.leveledUp) {
        setLevelUpData({
          isOpen: true,
          previousLevel: res.progression.previousLevel,
          newLevel: res.progression.newLevel,
          newTitle: res.character.title,
        });
      }

      // Check achievements unlock
      if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
        res.unlockedAchievements.forEach((ach) => toast.achievement(ach));
      }

      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete quest.');
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading || !character) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Floating Rewards Burst */}
      <FlyingRewards burst={rewardBurst} onComplete={() => setRewardBurst(null)} />

      {/* Level Up Celebration Modal */}
      <CelebrationModal
        isOpen={levelUpData.isOpen}
        previousLevel={levelUpData.previousLevel}
        newLevel={levelUpData.newLevel}
        newTitle={levelUpData.newTitle}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Create Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuest}
      />

      {/* Hero Character Card */}
      <div className="rounded-3xl bg-citadel/80 border border-cyber-purple/40 shadow-glow-purple/20 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          {/* Avatar Visualizer */}
          <div className="shrink-0">
            <AvatarVisualizer character={character} size="md" />
          </div>

          {/* Hero Details & Progression Bar */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
                Tier {Math.ceil(character.level / 5)} Hero
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-xs text-slate-300 font-medium font-rpg">
                {character.title}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white tracking-wide">
              Welcome, Champion
            </h1>

            {/* XP Progress Bar */}
            <div className="mt-4 max-w-2xl">
              <XPProgressBar
                currentXP={character.xp}
                level={character.level}
                nextLevelXP={character.nextLevelXP}
                progressPercentage={character.progressPercentage}
              />
            </div>

            {/* Quick Stats Summary & Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => {
                  playClick();
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-xs uppercase tracking-wider shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Forge Quest</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onNavigate('shop');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white hover:border-amber-500/50 font-cyber font-bold text-xs uppercase tracking-wider transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-cyber-amber" />
                <span>Armory ({character.gold} G)</span>
              </button>

              <div className="hidden sm:block">
                <StreakBadge
                  currentStreak={character.currentStreak}
                  longestStreak={character.longestStreak}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Character Attributes Panel */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            <h2 className="text-sm uppercase tracking-widest font-cyber font-bold text-slate-200">
              Core Attributes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('character')}
            className="text-xs text-cyber-cyan hover:underline font-medium flex items-center gap-1"
          >
            <span>View Full Character</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <AttributeBars character={character} />
      </div>

      {/* Active Quests & Activity History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Active Quests (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyber-purple" />
              <h2 className="text-sm uppercase tracking-widest font-cyber font-bold text-slate-200">
                Active Quests ({quests.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('quests')}
              className="text-xs text-cyber-purple hover:underline font-medium flex items-center gap-1"
            >
              <span>Manage Quests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {quests.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No Active Quests In Ledger"
              description="Your quest board is clear! Forge a new task to earn experience points and gold."
              actionText="Forge Quest"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={handleCompleteQuest}
                  isCompleting={completingId === quest.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Chronicles (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyber-amber" />
              <h2 className="text-sm uppercase tracking-widest font-cyber font-bold text-slate-200">
                Recent Chronicles
              </h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyber-amber hover:underline font-medium flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-4 divide-y divide-slate-800/80 backdrop-blur-md">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No chronicles recorded yet. Complete a quest to write history.
              </p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 truncate max-w-[180px]">
                      {log.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {log.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
