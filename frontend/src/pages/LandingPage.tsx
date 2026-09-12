import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Sword,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { useSound } from '../context/SoundContext.js';
import confetti from 'canvas-confetti';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { playQuestComplete, playClick } = useSound();
  const [demoCompleted, setDemoCompleted] = useState(false);

  const handleDemoComplete = () => {
    if (demoCompleted) return;
    setDemoCompleted(true);
    playQuestComplete();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#22D3EE', '#F59E0B'],
    });
  };

  return (
    <div className="min-h-screen bg-cyber-radial text-white pb-16 selection:bg-cyber-purple selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-cyber-purple/60 text-cyber-purple text-xs md:text-sm font-cyber font-semibold shadow-glow-purple/20 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Next Evolution of Gamified Productivity</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-rpg text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-purple-300 leading-tight md:leading-none max-w-4xl mx-auto"
        >
          Turn Your Real Life Into An Epic Adventure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Mundane tasks become heroic quests. Slay procrastination, earn real XP, level up your core attributes, forge unbreakable streaks, and unlock legendary armor.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              playClick();
              onNavigate('register');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-sm tracking-wider uppercase shadow-glow-purple hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              playClick();
              onNavigate('login');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-citadel/80 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-cyber font-bold text-sm tracking-wider uppercase backdrop-blur-md transition-all"
          >
            Enter The Realm
          </button>
        </motion.div>

        {/* Interactive Live Demo Quest Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-lg mx-auto text-left"
        >
          <div className="text-[11px] uppercase tracking-widest text-cyber-cyan font-cyber font-bold text-center mb-2">
            Try the Dopamine Feedback Loop
          </div>
          <div
            className={`p-5 rounded-2xl border transition-all duration-300 ${
              demoCompleted
                ? 'bg-emerald-950/20 border-emerald-500/50 shadow-glow-emerald/30'
                : 'bg-citadel/90 border-cyber-purple/50 shadow-glow-purple/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                💻 Coding Trial
              </span>
              <span className="px-2.5 py-0.5 rounded-full border border-purple-500/40 text-purple-400 bg-purple-950/20 text-xs font-cyber font-semibold">
                Medium Difficulty
              </span>
            </div>

            <h3 className="text-base font-bold font-rpg text-white">
              Study System Architecture for 90 Minutes
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Design a scalable distributed event bus with real-time replication.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-cyber">
                <span className="text-cyber-purple font-semibold">+100 XP</span>
                <span className="text-cyber-gold font-semibold">+40 Gold</span>
                <span className="text-cyber-cyan font-semibold">+4 Intellect</span>
              </div>

              <button
                onClick={handleDemoComplete}
                disabled={demoCompleted}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-cyber font-bold text-xs uppercase tracking-wider transition-all ${
                  demoCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-glow-purple hover:brightness-110 active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{demoCompleted ? 'Conquered!' : 'Complete Quest'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-cyber-purple font-cyber font-bold">
            The Gameplay Loop
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-rpg text-white mt-1">
            Engineered For Immediate Gratification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-citadel/60 border border-slate-800 hover:border-cyber-purple/50 backdrop-blur-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-800 flex items-center justify-center text-cyber-purple mb-4 group-hover:scale-110 transition-transform">
              <Sword className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rpg text-white">The Quest Engine</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Create structured tasks categorized by real-world disciplines. Automatically calculates XP, Gold, and attribute bounties based on difficulty.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-citadel/60 border border-slate-800 hover:border-cyber-cyan/50 backdrop-blur-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-800 flex items-center justify-center text-cyber-cyan mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rpg text-white">5-Attribute Progression</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Coding boosts Intellect. Gym training builds Strength. Reading elevates Wisdom. Watch your virtual character stats mirror your actual growth.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-citadel/60 border border-slate-800 hover:border-amber-500/50 backdrop-blur-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800 flex items-center justify-center text-cyber-amber mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rpg text-white">Unbroken Streaks & Armory</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
              Maintain daily activity to fuel your streak multiplier. Spend earned gold in the Armory to equip mythic swords, cloaks, and cosmic auras.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mt-12 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-citadel to-obsidian border border-cyber-purple/40 shadow-glow-purple/20">
          <Trophy className="w-12 h-12 text-cyber-gold mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-extrabold font-rpg text-white">
            Ready To Ascend?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mt-2 mb-6">
            Join the realm of Life RPG and turn self-improvement into an addictive journey.
          </p>
          <button
            onClick={() => {
              playClick();
              onNavigate('register');
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white font-cyber font-bold text-xs sm:text-sm uppercase tracking-wider shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
          >
            Create Your Character
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
