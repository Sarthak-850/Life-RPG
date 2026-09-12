import React from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useSound } from '../../context/SoundContext.js';
import { Volume2, VolumeX, Coins, User, LogOut, Shield } from 'lucide-react';
import StreakBadge from '../character/StreakBadge.js';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, character, logout, isAuthenticated } = useAuth();
  const { isMuted, toggleMute, playClick } = useSound();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleNav = (page: string) => {
    playClick();
    onNavigate(page);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-citadel/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-[10px] bg-citadel flex items-center justify-center text-cyber-cyan font-cyber font-bold text-base">
            ⚔
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-cyber font-extrabold text-base md:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyber-purple">
            LIFE RPG
          </span>
          <span className="text-[9px] uppercase tracking-widest text-cyber-cyan font-semibold -mt-1 hidden sm:inline">
            Chronicles of Self
          </span>
        </div>
      </div>

      {/* Right Actions & Player HUD */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sound FX Toggle */}
        <button
          onClick={() => {
            toggleMute();
            playClick();
          }}
          title={isMuted ? 'Unmute synthesized audio' : 'Mute audio'}
          className={`p-2 rounded-xl border transition-all ${
            isMuted
              ? 'bg-slate-900 border-slate-700 text-slate-500'
              : 'bg-purple-950/40 border-cyber-purple/50 text-cyber-purple shadow-glow-purple/20'
          }`}
          aria-label="Toggle sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {isAuthenticated && character ? (
          <>
            {/* Streak Counter */}
            <div className="hidden sm:block">
              <StreakBadge
                currentStreak={character.currentStreak}
                longestStreak={character.longestStreak}
                compact
              />
            </div>

            {/* Gold Counter */}
            <div
              onClick={() => handleNav('shop')}
              title="Gold Treasury - Click to visit Armory"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-cyber-gold text-xs md:text-sm font-cyber font-bold shadow-glow-gold/30 cursor-pointer hover:border-amber-400 transition-all"
            >
              <Coins className="w-4 h-4 text-cyber-amber animate-pulse" />
              <span>{character.gold}</span>
            </div>

            {/* Level Pill */}
            <div
              onClick={() => handleNav('character')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 border border-cyber-purple/50 text-white text-xs font-cyber font-bold shadow-glow-purple/20 cursor-pointer hover:border-cyber-purple transition-all hidden md:flex"
            >
              <span className="text-cyber-purple">LVL</span>
              <span>{character.level}</span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900 transition-all"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyber-purple to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user?.username.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden lg:inline max-w-[90px] truncate">
                  {user?.username}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-obsidian border border-slate-700 shadow-2xl py-2 text-xs font-medium">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-white font-bold truncate">{user?.username}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => handleNav('character')}
                    className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-cyber-cyan" />
                    <span>Hero Profile</span>
                  </button>

                  <button
                    onClick={() => handleNav('settings')}
                    className="w-full px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-cyber-purple" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      playClick();
                      await logout();
                      onNavigate('landing');
                    }}
                    className="w-full px-4 py-2.5 text-left text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Realm</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('login')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-semibold tracking-wider transition-all"
            >
              Log In
            </button>
            <button
              onClick={() => handleNav('register')}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-cyber font-bold text-xs tracking-wider shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
