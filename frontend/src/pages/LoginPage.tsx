import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { useSound } from '../context/SoundContext.js';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const toast = useToast();
  const { playClick, playError, playQuestComplete } = useSound();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await login({ email, password });
      playQuestComplete();
      toast.success('Welcome back to the Realm!');
      onNavigate('dashboard');
    } catch (err: any) {
      playError();
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    playClick();
    setEmail('hero_a@liferpg.dev');
    setPassword('Password123!');
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
              ⚔
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-cyber-cyan font-cyber font-bold">
            Portal of Entrance
          </span>
          <h2 className="text-2xl font-bold font-rpg text-white mt-0.5">Resume Journey</h2>
          <p className="text-xs text-text-secondary mt-1">
            Access your quest ledger and character progression.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Secret Key (Password)
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
            <span>{loading ? 'Entering Realm...' : 'Enter Realm'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Account Quick-Fill */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="inline-flex items-center gap-1.5 text-xs text-cyber-cyan hover:underline font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fill Demo Adventurer Credentials</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-4 text-center text-xs text-slate-400">
          New to the realm?{' '}
          <button
            type="button"
            onClick={() => {
              playClick();
              onNavigate('register');
            }}
            className="text-cyber-purple font-semibold hover:underline"
          >
            Forge a Character
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
