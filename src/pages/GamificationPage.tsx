import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Star,
  Users,
  Target,
  Crown,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BADGES_LIST, LEADERBOARD_USERS } from '../data/mockData';
import { triggerConfetti, triggerLevelUpConfetti } from '../utils/confetti';

export const GamificationPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { weeklyChallenges, addXP } = useApp();

  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'overall' | 'tutors' | 'streaks'>('overall');
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);

  // Claim Daily Streak XP Bonus
  const handleClaimDailyStreak = () => {
    if (hasClaimedDaily || !currentUser) return;
    setHasClaimedDaily(true);
    addXP(100, 'Daily Streak Check-In');
    updateProfile({
      streakDays: currentUser.streakDays + 1,
    });
    triggerLevelUpConfetti();
  };

  const levelTitles = [
    'Scout Novice',
    'Curious Apprentice',
    'Active Practitioner',
    'Skill Scholar',
    'Mentor in Training',
    'Senior Peer Tutor',
    'Master Specialist',
    'Knowledge Champion',
    'Platform Luminary',
    'SkillSphere Grandmaster',
  ];

  const currentLevelTitle = currentUser ? levelTitles[currentUser.level - 1] || 'Grandmaster' : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Level Showcase Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                Gamified Peer Learning
              </span>
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-900 px-3 py-1 rounded-full shadow-sm">
                <Flame className="w-4 h-4 fill-slate-900 animate-bounce" />
                {currentUser?.streakDays || 7} Day Streak!
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Level {currentUser?.level || 4}: {currentLevelTitle}
            </h1>
            <p className="text-sm text-white/90 max-w-xl leading-relaxed">
              Earn XP by completing cashless skill swaps, helping peers on the forum, passing AI quizzes, and keeping your daily study streak alive.
            </p>

            {/* Daily Streak Claim Button */}
            <div className="pt-2">
              <button
                onClick={handleClaimDailyStreak}
                disabled={hasClaimedDaily}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>{hasClaimedDaily ? '✓ Daily Bonus Claimed (+100 XP)' : 'Claim Daily Streak Bonus (+100 XP)'}</span>
              </button>
            </div>
          </div>

          {/* XP & Trophies Counter Box */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center font-black text-3xl shadow-inner">
              ⭐
            </div>
            <div>
              <div className="text-3xl font-black">{currentUser?.xp || 2840}</div>
              <div className="text-xs text-white/80 font-bold uppercase tracking-wider">Total Lifetime XP</div>
            </div>
            <div className="text-[11px] text-white/70">
              Next Rank: Level {(currentUser?.level || 4) + 1} at {((currentUser?.level || 4) * 1000)} XP
            </div>
          </div>
        </div>
      </div>

      {/* 2. LEVEL PROGRESSION ROADMAP */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#5865F2]" />
            Learning Levels & Tier Progression
          </h2>
          <p className="text-xs text-slate-500">Every 1,000 XP unlocks a new title, profile border, and exclusive badges</p>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {levelTitles.slice(0, 5).map((title, idx) => {
            const lvlNum = idx + 1;
            const isReached = (currentUser?.level || 4) >= lvlNum;
            const isCurrent = (currentUser?.level || 4) === lvlNum;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center space-y-1.5 transition-all ${
                  isCurrent
                    ? 'border-[#5865F2] bg-[#5865F2]/10 ring-2 ring-[#5865F2] shadow-md'
                    : isReached
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-[#5865F2] text-white'
                      : isReached
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {isReached ? '✓' : lvlNum}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Lvl {lvlNum}</div>
                <div className="text-[11px] text-slate-500 truncate">{title}</div>
                <div className="text-[10px] font-mono text-slate-400">{lvlNum * 1000} XP</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACHIEVEMENTS & BADGES SHELF */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Trophy Room & Badges ({BADGES_LIST.length})
            </h2>
            <p className="text-xs text-slate-500">Collect special accolades for outstanding peer contributions</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600">
            {currentUser?.badges.length || 0} of {BADGES_LIST.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = currentUser?.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                  isUnlocked
                    ? 'glass-card border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 opacity-50 bg-slate-100/40 dark:bg-slate-900/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isUnlocked ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? '🏆' : <Lock className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      +{badge.xpReward} XP
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isUnlocked ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span>Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GLOBAL COMMUNITY LEADERBOARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Community Leaderboard
            </h2>
            <p className="text-xs text-slate-500">Recognizing top learners and peer mentors this season</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveLeaderboardTab('overall')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeLeaderboardTab === 'overall' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Overall XP
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('tutors')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeLeaderboardTab === 'tutors' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Top Mentors
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('streaks')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeLeaderboardTab === 'streaks' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Longest Streaks
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Live Sessions</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {LEADERBOARD_USERS.map((user, idx) => {
                const isCurrentUser = user.id === currentUser?.id;

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                      isCurrentUser ? 'bg-[#5865F2]/5 dark:bg-[#5865F2]/10 font-bold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-black text-xs shadow-sm">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold px-2">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {user.name} {isCurrentUser && <span className="text-[#5865F2] font-semibold">(You)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{user.headline}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-semibold bg-[#5865F2]/10 text-[#5865F2]">
                        Level {user.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {user.streakDays}d
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {user.sessionsCompleted} sessions
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#5865F2] dark:text-[#818CF8]">
                      {user.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

