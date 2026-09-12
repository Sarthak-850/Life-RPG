import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { Quest, QuestCategory, QuestDifficulty } from '../types/index.js';
import QuestCard from '../components/quests/QuestCard.js';
import QuestModal from '../components/quests/QuestModal.js';
import CelebrationModal from '../components/effects/CelebrationModal.js';
import FlyingRewards, { RewardBurst } from '../components/effects/FlyingRewards.js';
import EmptyState from '../components/common/EmptyState.js';
import { SkeletonCard } from '../components/common/Skeleton.js';
import { Plus, Search, CheckCircle2 } from 'lucide-react';

export const QuestsPage: React.FC = () => {
  const { refreshCharacter } = useAuth();
  const { playClick, playQuestComplete } = useSound();
  const toast = useToast();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // FX states
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

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await api.getQuests();
      setQuests(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch quests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const handleCreateOrUpdate = async (data: {
    title: string;
    description?: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
  }) => {
    if (editingQuest) {
      const updated = await api.updateQuest(editingQuest.id, data);
      setQuests((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      toast.success('Quest modified.');
    } else {
      const created = await api.createQuest(data);
      setQuests((prev) => [created, ...prev]);
      toast.success('New Quest forged!');
    }
    setEditingQuest(null);
  };

  const handleDelete = async (questId: string) => {
    if (window.confirm('Are you sure you wish to banish this quest?')) {
      try {
        await api.deleteQuest(questId);
        setQuests((prev) => prev.filter((q) => q.id !== questId));
        toast.info('Quest banished from your ledger.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete quest.');
      }
    }
  };

  const handleComplete = async (questId: string) => {
    setCompletingId(questId);
    try {
      const res = await api.completeQuest(questId);
      playQuestComplete();

      // Trigger reward burst
      setRewardBurst({
        id: Math.random().toString(),
        xp: res.progression.xpEarned,
        gold: res.progression.goldEarned,
        attribute: res.progression.attributeEarned,
        attributeAmount: res.progression.attributeAmount,
      });

      // Update locally
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
      );

      // Check level up
      if (res.progression.leveledUp) {
        setLevelUpData({
          isOpen: true,
          previousLevel: res.progression.previousLevel,
          newLevel: res.progression.newLevel,
          newTitle: res.character.title,
        });
      }

      // Check achievements
      if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
        res.unlockedAchievements.forEach((ach) => toast.achievement(ach));
      }

      await refreshCharacter();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete quest.');
    } finally {
      setCompletingId(null);
    }
  };

  // Filtering Logic
  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'active' && q.isCompleted) return false;
    if (activeTab === 'completed' && !q.isCompleted) return false;
    if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    if (
      searchQuery &&
      !q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categories = ['All', 'Coding', 'Study', 'Fitness', 'Health', 'Reading', 'Work', 'Personal', 'Mindfulness', 'Other'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Epic'];

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

      {/* Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialQuest={editingQuest}
      />

      {/* Top Header & Forge Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
            Objective Command
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
            Quest Ledger
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your daily tasks, earn bounties, and conquer procrastination.
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-xs uppercase tracking-wider shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Forge New Quest</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-4 space-y-3 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests by title or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple text-xs md:text-sm"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => {
                playClick();
                setActiveTab('active');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-cyber font-bold transition-all ${
                activeTab === 'active'
                  ? 'bg-cyber-purple text-white shadow-glow-purple/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveTab('completed');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-cyber font-bold transition-all ${
                activeTab === 'completed'
                  ? 'bg-cyber-emerald text-white shadow-glow-emerald/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Conquered
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveTab('all');
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-cyber font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1">
            Category:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-950/50 border-cyber-purple text-white shadow-glow-purple/20'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-4 bg-slate-800 mx-2" />

          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1">
            Difficulty:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-cyan-950/50 border-cyber-cyan text-white shadow-glow-cyan/20'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredQuests.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No Quests Match Criteria"
          description="Try clearing your filters or forge a new quest into your journal."
          actionText="Forge New Quest"
          onAction={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={handleComplete}
              onEdit={(q) => {
                setEditingQuest(q);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              isCompleting={completingId === quest.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
