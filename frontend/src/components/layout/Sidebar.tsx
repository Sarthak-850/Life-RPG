import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  User,
  ShoppingBag,
  Package,
  Trophy,
  History,
  Settings,
} from 'lucide-react';
import { useSound } from '../../context/SoundContext.js';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { playClick } = useSound();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'character', label: 'Character', icon: User },
    { id: 'shop', label: 'Armory Shop', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'history', label: 'Chronicles', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-citadel/60 border-r border-slate-800/80 p-4 min-h-[calc(100vh-4rem)]">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2">
        Realm Navigation
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                playClick();
                onNavigate(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-950/70 to-indigo-950/40 border border-cyber-purple/50 text-white shadow-glow-purple/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-cyber-cyan' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-glow-cyan" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Decorative RPG Quote */}
      <div className="mt-auto p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
        <p className="italic font-serif">"Discipline is the bridge between goals and accomplishment."</p>
        <div className="text-[9px] font-cyber text-cyber-purple font-semibold mt-1.5 uppercase">
          ⚔ Ascend Daily
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
