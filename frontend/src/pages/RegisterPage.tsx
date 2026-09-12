import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { useSound } from '../context/SoundContext.js';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const toast = useToast();
  const { playClick, playError, playLevelUp } = useSound();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await register({ username, email, password });
      playLevelUp();
      toast.success('Your Hero has been created! Welcome to Life RPG.');
      onNavigate('dashboard');
    } catch (err: any) {
      playError();
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-radial flex items-center justify-center p-4 selection:bg-cyber-purple selection:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-citadel/90 border border-cyber-purple/40 shadow-glow-purple/20 p-6 md:p-8 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-glow-purple mb-3">
            <div className="w-full h-full rounded-[10px] bg-citadel flex items-center justify-center text-cyber-cyan font-cyber font-bold text-lg">
              ✨
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
            Character Creation
          </span>
          <h2 className="text-2xl font-bold font-rpg text-white mt-0.5">Forge Your Hero</h2>
          <p className="text-xs text-text-secondary mt-1">
            Begin your journey with Level 1 stats and 50 starting Gold.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Hero Name (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Valkyrie_99"
                maxLength={24}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@realm.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Secret Passphrase (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-purple text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-xs uppercase tracking-wider shadow-glow-purple hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Manifesting Hero...' : 'Begin Adventure'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already forged an identity?{' '}
          <button
            type="button"
            onClick={() => {
              playClick();
              onNavigate('login');
            }}
            className="text-cyber-cyan font-semibold hover:underline"
          >
            Enter Realm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
