import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext.js';
import api from '../services/api.js';
import { ActivityLog } from '../types/index.js';
import {
  History,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Trophy,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import EmptyState from '../components/common/EmptyState.js';

export const HistoryPage: React.FC = () => {
  const toast = useToast();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p = 1, type = '') => {
    try {
      setLoading(true);
      const res = await api.getHistory(p, 15, type || undefined);
      setLogs(res.logs);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch history logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, typeFilter);
  }, [page, typeFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'QUEST_COMPLETE':
        return <CheckCircle2 className="w-5 h-5 text-cyber-purple" />;
      case 'LEVEL_UP':
        return <TrendingUp className="w-5 h-5 text-cyber-cyan" />;
      case 'ITEM_PURCHASED':
        return <ShoppingBag className="w-5 h-5 text-cyber-amber" />;
      case 'ITEM_EQUIPPED':
        return <Shield className="w-5 h-5 text-cyber-emerald" />;
      case 'ACHIEVEMENT_UNLOCKED':
        return <Trophy className="w-5 h-5 text-cyber-gold" />;
      default:
        return <History className="w-5 h-5 text-slate-400" />;
    }
  };

  const types = [
    { label: 'All Chronicles', value: '' },
    { label: 'Quests Conquered', value: 'QUEST_COMPLETE' },
    { label: 'Ascensions', value: 'LEVEL_UP' },
    { label: 'Armory Purchases', value: 'ITEM_PURCHASED' },
    { label: 'Equipments', value: 'ITEM_EQUIPPED' },
    { label: 'Achievements', value: 'ACHIEVEMENT_UNLOCKED' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
          Historical Chronicles
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
          The Hero's Timeline
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          A persistent chronological record of every triumph, ascension, and acquisition.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTypeFilter(t.value);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-cyber font-semibold transition-all ${
              typeFilter === t.value
                ? 'bg-purple-950/70 border-cyber-purple text-white shadow-glow-purple/20'
                : 'bg-citadel/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline Feed */}
      <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-4 md:p-6 backdrop-blur-md">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Consulting the ancient chronicles...
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="Chronicles are Empty"
            description="Complete quests or acquire gear in the armory to record your legendary acts."
          />
        ) : (
          <div className="divide-y divide-slate-800/80">
            {logs.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getTypeIcon(log.type)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white font-rpg">{log.title}</h4>
                    <span className="text-[11px] text-slate-400 font-cyber">
                      {new Date(log.createdAt).toLocaleDateString()}{' '}
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary mt-1">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages} ({total} entries)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
