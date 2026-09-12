/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#070A12',
        citadel: '#0D1220',
        obsidian: '#12192A',
        surface: {
          dark: '#070A12',
          card: '#0D1220',
          elevated: '#12192A',
          border: '#1E293B',
          glow: 'rgba(139, 92, 246, 0.25)',
        },
        cyber: {
          purple: '#8B5CF6',
          violet: '#A855F7',
          cyan: '#22D3EE',
          blue: '#38BDF8',
          amber: '#F59E0B',
          gold: '#FBBF24',
          emerald: '#22C55E',
          rose: '#F43F5E',
          crimson: '#EF4444',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(34, 211, 238, 0.45)',
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(34, 197, 94, 0.45)',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        cyber: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.02)' },
        },
        floatUp: {
          '0%': { opacity: 1, transform: 'translateY(0px)' },
          '100%': { opacity: 0, transform: 'translateY(-40px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float-up': 'floatUp 1.2s forwards ease-out',
      }
    },
  },
  plugins: [],
};
