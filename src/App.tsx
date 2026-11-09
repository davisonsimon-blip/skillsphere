import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AIAssistantModal } from './components/ai/AIAssistantModal';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PeerMatchingPage } from './pages/PeerMatchingPage';
import { SkillExchangePage } from './pages/SkillExchangePage';
import { LiveRoomPage } from './pages/LiveRoomPage';
import { ForumPage } from './pages/ForumPage';
import { GamificationPage } from './pages/GamificationPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

// System Announcement Banner Component
const GlobalBanner: React.FC = () => {
  const { systemAnnouncement, setSystemAnnouncement } = useApp();
  if (!systemAnnouncement) return null;

  return (
    <div className="bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-3 relative z-50">
      <span>{systemAnnouncement}</span>
      <button
        onClick={() => setSystemAnnouncement(null)}
        className="text-white/80 hover:text-white ml-2 text-xs font-bold"
        title="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#101828] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <GlobalBanner />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<PeerMatchingPage />} />
          <Route path="/exchanges" element={<SkillExchangePage />} />
          <Route path="/live-room" element={<LiveRoomPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <AIAssistantModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
