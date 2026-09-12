import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useSound } from '../context/SoundContext.js';
import { useToast } from '../context/ToastContext.js';
import { Volume2, VolumeX, LogOut, User, Palette, Check } from 'lucide-react';
import api from '../services/api.js';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, character, updateCharacter, logout } = useAuth();
  const { isMuted, toggleMute, playClick, playQuestComplete, playLevelUp, playPurchase } = useSound();
  const toast = useToast();

  const colorOptions = [
    { id: 'purple', name: 'Cyber Violet', class: 'bg-cyber-purple' },
    { id: 'cyan', name: 'Neon Cyan', class: 'bg-cyber-cyan' },
    { id: 'crimson', name: 'Blood Crimson', class: 'bg-rose-600' },
    { id: 'amber', name: 'Solar Amber', class: 'bg-amber-500' },
    { id: 'emerald', name: 'Jade Emerald', class: 'bg-emerald-500' },
  ];

  const handleColorChange = async (colorId: string) => {
    playClick();
    try {
      const updated = await api.updateAppearance(colorId);
      updateCharacter(updated);
      toast.success('Hero aura updated.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update appearance.');
    }
  };

  const handleLogout = async () => {
    playClick();
    await logout();
    toast.info('Safely logged out.');
    onNavigate('landing');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
          System Preferences
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-rpg text-white">
          Sanctum Settings
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure synthesized audio, customize appearance, and manage your account.
        </p>
      </div>

      {/* Audio Engine Configuration */}
      <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800 text-cyber-purple">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold font-rpg text-white">Web Audio Synthesizer</h3>
              <p className="text-xs text-text-secondary">
                Generate in-browser tactile feedback, chimes, and fanfare.
              </p>
            </div>
          </div>

          <button
            onClick={toggleMute}
            className={`px-4 py-2 rounded-xl text-xs font-cyber font-bold uppercase transition-all ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-cyber-purple text-white shadow-glow-purple'
            }`}
          >
            {isMuted ? 'Muted' : 'Enabled'}
          </button>
        </div>

        {/* Audio Test Bench */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Soundboard Test
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={playQuestComplete}
              disabled={isMuted}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:text-white disabled:opacity-40"
            >
              Test Quest Chime
            </button>
            <button
              onClick={playLevelUp}
              disabled={isMuted}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:text-white disabled:opacity-40"
            >
              Test Level Up Fanfare
            </button>
            <button
              onClick={playPurchase}
              disabled={isMuted}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:text-white disabled:opacity-40"
            >
              Test Coin Clink
            </button>
          </div>
        </div>
      </div>

      {/* Visual Aura Color */}
      <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyber-cyan">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-rpg text-white">Hero Aura Color</h3>
            <p className="text-xs text-text-secondary">
              Alters your character's visual aura glow and dashboard accents.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {colorOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => handleColorChange(c.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                character?.avatarColor === c.id
                  ? 'border-white/50 bg-slate-800/80 shadow-lg'
                  : 'border-slate-800 bg-slate-900/50 opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${c.class}`} />
              <span className="text-xs font-medium text-slate-200">{c.name}</span>
              {character?.avatarColor === c.id && <Check className="w-3.5 h-3.5 text-cyber-cyan" />}
            </button>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl bg-citadel/60 border border-slate-800 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-rpg text-white">Hero Identity</h3>
            <p className="text-xs text-text-secondary">
              Account parameters saved in the database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Username</span>
            <div className="text-white font-bold text-sm mt-0.5">{user?.username}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Email Address</span>
            <div className="text-white font-bold text-sm mt-0.5">{user?.email}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 text-xs font-cyber font-bold uppercase transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
