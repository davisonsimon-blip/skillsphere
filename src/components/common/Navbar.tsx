import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Repeat,
  Video,
  MessageSquare,
  Trophy,
  Bot,
  Shield,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  Flame,
  CheckCheck,
  ChevronDown,
  UserCheck,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, switchDemoAccount, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadNotificationsCount, markNotificationAsRead, clearAllNotifications } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: GraduationCap },
    { name: 'Find Peers', path: '/matches', icon: Users },
    { name: 'Skill Exchanges', path: '/exchanges', icon: Repeat },
    { name: 'Live Room', path: '/live-room', icon: Video },
    { name: 'Forum', path: '/forum', icon: MessageSquare },
    { name: 'SphereAI', path: '/ai-assistant', icon: Bot },
    { name: 'Badges & XP', path: '/gamification', icon: Trophy },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#5865F2]/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                SkillSphere
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                P2P
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#5865F2]/10 text-[#5865F2] dark:bg-[#5865F2]/20 dark:text-[#818CF8] font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5865F2] dark:text-[#818CF8]' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gamification Streak & XP Pills (If user logged in) */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2">
                {/* Streak Badge */}
                <div
                  title={`${currentUser.streakDays} Day Learning Streak! Keep it alive!`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
                  <span>{currentUser.streakDays}d</span>
                </div>

                {/* Level & XP Pill */}
                <Link
                  to="/gamification"
                  title="View Levels & Achievements"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-semibold hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
                  <span>Lvl {currentUser.level}</span>
                  <span className="text-slate-400 text-[10px]">({currentUser.xp} XP)</span>
                </Link>
              </div>
            )}

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDemoMenuOpen(!isDemoMenuOpen);
                  setIsNotifOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                title="Switch test persona instantly"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>Demo As:</span>
                <span className="font-semibold capitalize text-[#5865F2] dark:text-[#818CF8]">
                  {currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'tutor' ? 'Tutor' : 'Learner'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDemoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Quick Switch Persona
                  </div>
                  <button
                    onClick={() => {
                      switchDemoAccount('learner');
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">Alex Chen</div>
                      <div className="text-slate-500 text-[11px]">Undergrad Learner & Tutor</div>
                    </div>
                    {currentUser?.id === 'user-current' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoAccount('tutor');
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">Dr. Maya Patel</div>
                      <div className="text-slate-500 text-[11px]">Senior AI Researcher (Tutor)</div>
                    </div>
                    {currentUser?.id === 'user-maya' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoAccount('admin');
                      setIsDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">Sarah Connor</div>
                      <div className="text-slate-500 text-[11px]">Platform Administrator</div>
                    </div>
                    {currentUser?.role === 'admin' && <span className="text-emerald-500 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsUserMenuOpen(false);
                  setIsDemoMenuOpen(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#5865F2] hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                            !n.isRead ? 'bg-[#5865F2]/5 dark:bg-[#5865F2]/10' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                          {n.link && (
                            <Link
                              to={n.link}
                              onClick={() => setIsNotifOpen(false)}
                              className="inline-block mt-1 text-[11px] font-medium text-[#5865F2] hover:underline"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Avatar / Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotifOpen(false);
                    setIsDemoMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#5865F2]/50 transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#5865F2]/30"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/exchanges"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Repeat className="w-4 h-4 text-slate-400" />
                      My Skill Swaps
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#5865F2]/25 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-[#5865F2] text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Switch persona:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchDemoAccount('learner')}
                className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Learner
              </button>
              <button
                onClick={() => switchDemoAccount('tutor')}
                className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Tutor
              </button>
              <button
                onClick={() => switchDemoAccount('admin')}
                className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
