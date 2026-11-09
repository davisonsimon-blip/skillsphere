import React, { useState } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Megaphone,
  Search,
  UserX,
  UserCheck,
  Trash2,
  Sparkles,
  BarChart3,
  Repeat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const { users, toggleUserStatus, changeUserRole } = useAuth();
  const {
    reports,
    resolveReport,
    posts,
    deletePost,
    exchanges,
    sessions,
    systemAnnouncement,
    setSystemAnnouncement,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'broadcast'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [announcementInput, setAnnouncementInput] = useState(systemAnnouncement || '');
  const [broadcastSaved, setBroadcastSaved] = useState(false);

  // Stats calculation
  const totalUsers = users.length;
  const activeLearners = users.filter((u) => u.status === 'active').length;
  const totalExchanges = exchanges.length;
  const totalSessions = sessions.length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemAnnouncement(announcementInput.trim() || null);
    setBroadcastSaved(true);
    setTimeout(() => setBroadcastSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Governance & Moderation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SkillSphere Admin Control Panel
          </h1>
          <p className="text-xs text-slate-500">
            Real-time analytics, user access controls, forum safety, and system broadcasts.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'overview' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'users' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            User Management ({totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Reports</span>
            {pendingReportsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingReportsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeTab === 'broadcast' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Announcements
          </button>
        </div>
      </div>

      {/* 2. TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Registered</span>
                <Users className="w-4 h-4 text-[#5865F2]" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-500 font-medium">100% active students</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Active Swaps</span>
                <Repeat className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalExchanges}
              </div>
              <div className="text-[11px] text-[#8B5CF6] font-medium">Cashless exchanges</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Live Sessions</span>
                <Activity className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {totalSessions}
              </div>
              <div className="text-[11px] text-emerald-500 font-medium">99.8% uptime</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Pending Reports</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {pendingReportsCount}
              </div>
              <div className="text-[11px] text-rose-500 font-medium">Require moderator action</div>
            </div>
          </div>

          {/* Interactive Charts Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Daily Learning Sessions Volume */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Live Session Activity (Last 7 Days)
                  </h3>
                  <p className="text-[11px] text-slate-500">Hours exchanged between peers</p>
                </div>
                <span className="text-xs font-bold text-emerald-500">+18% vs last week</span>
              </div>

              {/* Bar Chart Bars */}
              <div className="h-44 flex items-end gap-3 pt-6 pb-2">
                {[
                  { day: 'Mon', h: 60, val: '240h' },
                  { day: 'Tue', h: 80, val: '320h' },
                  { day: 'Wed', h: 75, val: '295h' },
                  { day: 'Thu', h: 90, val: '380h' },
                  { day: 'Fri', h: 85, val: '340h' },
                  { day: 'Sat', h: 100, val: '430h' },
                  { day: 'Sun', h: 95, val: '410h' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] text-slate-400 font-medium">{item.val}</span>
                    <div
                      className="w-full bg-gradient-to-t from-[#5865F2] to-[#8B5CF6] rounded-xl hover:opacity-85 transition-all"
                      style={{ height: `${item.h}%` }}
                    ></div>
                    <span className="text-[11px] text-slate-500 font-bold">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Top Exchanged Skills */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Top Exchanged Skills Demand
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  { name: 'Python & PyTorch Machine Learning', pct: 92, count: '1,420 swaps' },
                  { name: 'React.js & TypeScript Frontend', pct: 88, count: '1,310 swaps' },
                  { name: 'Figma UI/UX & Design Systems', pct: 76, count: '980 swaps' },
                  { name: 'Conversational Spanish & German', pct: 64, count: '740 swaps' },
                  { name: 'Cyber Security & Ethical Hacking', pct: 52, count: '510 swaps' },
                ].map((skill, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{skill.name}</span>
                      <span className="text-slate-400 text-[11px]">{skill.count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5865F2] to-[#22D3EE] rounded-full"
                        style={{ width: `${skill.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Registered Users Directory
              </h3>
              <p className="text-xs text-slate-500">Manage account status, verify roles, and handle access</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">XP & Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 capitalize"
                      >
                        <option value="learner">Learner</option>
                        <option value="tutor">Tutor</option>
                        <option value="both">Both</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      Level {u.level} ({u.xp} XP)
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            u.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: REPORTS & MODERATION */}
      {activeTab === 'reports' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Reported Content & Complaints Queue
            </h3>
            <p className="text-xs text-slate-500">Review flagged forum questions, spam, and student complaints</p>
          </div>

          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                All clear! No pending reports found.
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-600 uppercase tracking-wider text-[10px]">
                        [{rep.targetType.replace('_', ' ')}]
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{rep.targetTitle}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Reason: <span className="italic">{rep.reason}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Reported by {rep.reportedBy} • {rep.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : rep.status === 'dismissed'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {rep.status}
                    </span>

                    {rep.status === 'pending' && (
                      <>
                        <button
                          onClick={() => resolveReport(rep.id, 'dismiss')}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => resolveReport(rep.id, 'resolve')}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                        >
                          Resolve & Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. TAB: BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'broadcast' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#5865F2]" />
              Platform-Wide Broadcast Banner
            </h3>
            <p className="text-xs text-slate-500">
              Display a global banner announcement at the top of every student's screen.
            </p>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Announcement Message (Leave empty to turn off banner):
              </label>
              <textarea
                rows={3}
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="e.g. 🚀 Welcome to SkillSphere v2.0! Exchange your knowledge with university peers today..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              {broadcastSaved ? (
                <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Banner updated across platform!
                </span>
              ) : (
                <span></span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow-md"
              >
                Publish Global Announcement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

