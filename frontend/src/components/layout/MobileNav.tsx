import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  User,
  ShoppingBag,
  Package,
  Trophy,
} from 'lucide-react';
import { useSound } from '../../context/SoundContext.js';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  const { playClick } = useSound();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'character', label: 'Hero', icon: User },
    { id: 'shop', label: 'Armory', icon: ShoppingBag },
    { id: 'inventory', label: 'Vault', icon: Package },
    { id: 'achievements', label: 'Badges', icon: Trophy },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-citadel/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
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
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
              isActive ? 'text-cyber-cyan' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_#22D3EE]' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileNav;
