import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.js';
import AppLayout from './components/layout/AppLayout.js';

// Pages
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import DashboardPage from './pages/DashboardPage.js';
import QuestsPage from './pages/QuestsPage.js';
import CharacterPage from './pages/CharacterPage.js';
import ShopPage from './pages/ShopPage.js';
import InventoryPage from './pages/InventoryPage.js';
import AchievementsPage from './pages/AchievementsPage.js';
import HistoryPage from './pages/HistoryPage.js';
import SettingsPage from './pages/SettingsPage.js';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Synchronize hash with current page
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string) => {
    window.location.hash = `#/${page}`;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      const publicPages = ['landing', 'login', 'register'];
      if (!isAuthenticated && !publicPages.includes(currentPage)) {
        navigate('login');
      } else if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
        navigate('dashboard');
      }
    }
  }, [isAuthenticated, isLoading, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-glow-purple animate-pulse">
          <div className="w-full h-full rounded-[14px] bg-citadel flex items-center justify-center text-cyber-cyan font-cyber font-bold text-2xl">
            ⚔
          </div>
        </div>
        <p className="mt-4 font-cyber text-xs tracking-widest text-slate-400 uppercase animate-pulse">
          Awakening Realm...
        </p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'quests':
        return <QuestsPage />;
      case 'character':
        return <CharacterPage onNavigate={navigate} />;
      case 'shop':
        return <ShopPage onNavigate={navigate} />;
      case 'inventory':
        return <InventoryPage onNavigate={navigate} />;
      case 'achievements':
        return <AchievementsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;
      default:
        return isAuthenticated ? <DashboardPage onNavigate={navigate} /> : <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={navigate}>
      {renderPage()}
    </AppLayout>
  );
};

export default App;
