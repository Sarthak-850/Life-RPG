import React from 'react';
import Navbar from './Navbar.js';
import Sidebar from './Sidebar.js';
import MobileNav from './MobileNav.js';
import { useAuth } from '../../context/AuthContext.js';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
}) => {
  const { isAuthenticated } = useAuth();
  const showChrome = isAuthenticated && currentPage !== 'landing';

  return (
    <div className="min-h-screen bg-cyber-radial text-slate-100 flex flex-col selection:bg-cyber-purple selection:text-white">
      {/* Top Navbar */}
      <Navbar onNavigate={onNavigate} currentPage={currentPage} />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (only when authenticated) */}
        {showChrome && <Sidebar currentPage={currentPage} onNavigate={onNavigate} />}

        {/* Dynamic Page Content */}
        <main className={`flex-1 w-full overflow-y-auto ${showChrome ? 'pb-20 md:pb-8' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (only when authenticated) */}
      {showChrome && <MobileNav currentPage={currentPage} onNavigate={onNavigate} />}
    </div>
  );
};

export default AppLayout;
