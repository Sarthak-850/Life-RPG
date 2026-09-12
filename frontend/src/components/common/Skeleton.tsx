import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl p-5 bg-citadel/50 border border-slate-800 animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-5 w-24 bg-slate-800 rounded-full" />
      <div className="h-5 w-16 bg-slate-800 rounded-full" />
    </div>
    <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
    <div className="h-4 w-1/2 bg-slate-800 rounded-lg" />
    <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
      <div className="h-5 w-32 bg-slate-800 rounded-lg" />
      <div className="h-8 w-24 bg-slate-800 rounded-xl" />
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-48 rounded-2xl bg-citadel/50 border border-slate-800 p-6 flex gap-6 items-center">
      <div className="w-36 h-36 rounded-2xl bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-4 w-full bg-slate-800 rounded-full" />
        <div className="h-6 w-32 bg-slate-800 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-20 bg-citadel/50 rounded-xl border border-slate-800" />
      ))}
    </div>
  </div>
);
