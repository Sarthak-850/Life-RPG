import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, Trophy, X } from 'lucide-react';
import { Achievement } from '../types/index.js';

export type ToastType = 'success' | 'error' | 'info' | 'achievement';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  achievement?: Achievement;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, achievement?: Achievement) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  achievement: (achievement: Achievement) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', achievement?: Achievement) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, achievement }]);

      setTimeout(() => {
        removeToast(id);
      }, type === 'achievement' ? 6000 : 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const achievement = useCallback(
    (ach: Achievement) => showToast(`Achievement Unlocked: ${ach.name}`, 'achievement', ach),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, achievement }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto rounded-xl p-4 shadow-xl border backdrop-blur-lg flex items-start gap-3 relative ${
                toast.type === 'success'
                  ? 'bg-citadel/95 border-cyber-emerald/50 text-emerald-300 shadow-glow-emerald/30'
                  : toast.type === 'error'
                  ? 'bg-citadel/95 border-cyber-crimson/50 text-rose-300 shadow-glow-purple/20'
                  : toast.type === 'achievement'
                  ? 'bg-gradient-to-r from-citadel via-obsidian to-citadel border-cyber-amber text-cyber-gold shadow-glow-gold'
                  : 'bg-citadel/95 border-cyber-cyan/50 text-cyan-300 shadow-glow-cyan/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-cyber-emerald" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-cyber-crimson" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-cyber-cyan" />}
                {toast.type === 'achievement' && <Trophy className="w-5 h-5 text-cyber-amber animate-pulse" />}
              </div>

              <div className="flex-1 text-sm font-medium pr-4">
                {toast.type === 'achievement' && toast.achievement ? (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-cyber-gold font-cyber">
                      🏆 Achievement Unlocked!
                    </div>
                    <div className="text-white font-bold text-sm mt-0.5">{toast.achievement.name}</div>
                    <div className="text-slate-300 text-xs mt-1">{toast.achievement.description}</div>
                    <div className="text-cyber-amber text-xs font-semibold mt-1">
                      +{toast.achievement.xpReward} XP &bull; +{toast.achievement.goldReward} Gold
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-100">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
