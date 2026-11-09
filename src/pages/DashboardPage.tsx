import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Trophy,
  Video,
  Repeat,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { BADGES_LIST } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { currentUser, users } = useAuth();
  const { exchanges, sessions, weeklyChallenges, setActiveLiveRoomId } = useApp();

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl text-center max-w-md space-y-4">
          <Sparkles className="w-12 h-12 text-[#5865F2] mx-auto" />
          <h2 className="text-xl font-bold">Please sign in to view your dashboard</h2>
          <Link
            to="/auth"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#5865F2] text-white font-bold text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Calculate XP progress to next level
  const currentXP = currentUser.xp;
  const currentLevel = currentUser.level;
  const nextLevelXP = currentLevel * 1000;
  const prevLevelXP = (currentLevel - 1) * 1000;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100))
  );

  // Filter user's upcoming sessions
  const userUpcomingSessions = sessions.filter(
    (s) => (s.learnerId === currentUser.id || s.tutorId === currentUser.id) && s.status !== 'cancelled'
  );

  // Filter user's active exchanges
  const userActiveExchanges = exchanges.filter(
    (ex) =>
      (ex.requesterId === currentUser.id || ex.partnerId === currentUser.id) &&
      (ex.status === 'in_progress' || ex.status === 'accepted')
  );

  // Recommended peer partners (different from current user)
  const recommendedPeers = users
    .filter((u) => u.id !== currentUser.id && u.role !== 'admin')
    .slice(0, 3);

  // Unlocked user badges
  const userBadges = BADGES_LIST.filter((b) => currentUser.badges.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. WELCOME BANNER WITH LEVEL PROGRESSION */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Student Dashboard
              </span>
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-slate-900" />
                {currentUser.streakDays} Day Streak!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="text-sm text-white/90 max-w-xl leading-relaxed">
              You are currently Level {currentUser.level} ({currentUser.xp} XP). Complete live sessions and help peers on the forum to reach Level {currentUser.level + 1}!
            </p>

            {/* XP Level Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-white/80">
                <span>Level {currentUser.level}</span>
                <span>{progressPercent}% towards Level {currentUser.level + 1}</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <Link
              to="/matches"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#5865F2]" />
              <span>Find New Peer</span>
            </Link>
            <Link
              to="/live-room"
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Enter Live Room</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Skills Taught</span>
            <BookOpen className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.skillsToTeach.length}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">Ready to exchange</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Skills Learning</span>
            <Target className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.skillsToLearn.length}
          </div>
          <div className="text-[11px] text-[#8B5CF6] font-medium">Active goals</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Swaps</span>
            <Repeat className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {userActiveExchanges.length}
          </div>
          <div className="text-[11px] text-slate-400">Cashless exchanges</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Peer Rating</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ⭐ {currentUser.rating.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-400">({currentUser.reviewsCount} reviews)</div>
        </div>
      </div>

      {/* 3. MAIN CONTENT SPLIT (UPCOMING SESSIONS & ACTIVE EXCHANGES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Sessions & Weekly Challenges */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Sessions */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Upcoming Learning Sessions</h3>
                  <p className="text-xs text-slate-500">Live 1-to-1 video rooms and collaborative study spaces</p>
                </div>
              </div>
              <Link
                to="/live-room"
                className="text-xs font-bold text-[#5865F2] dark:text-[#818CF8] hover:underline"
              >
                Open Room →
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {userUpcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No upcoming sessions. Schedule an exchange with a peer!
                </div>
              ) : (
                userUpcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={session.tutorAvatar}
                        alt={session.tutorName}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {session.title}
                          </span>
                          {session.status === 'live' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Tutor: <span className="font-medium text-slate-700 dark:text-slate-300">{session.tutorName}</span> • Skill: <span className="text-[#5865F2]">{session.skillName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{session.scheduledTime} ({session.durationMinutes} mins)</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/live-room"
                      onClick={() => setActiveLiveRoomId(session.meetingRoomId)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold shadow-md hover:opacity-95 text-center shrink-0"
                    >
                      {session.status === 'live' ? 'Join Now' : 'Enter Lobby'}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Skill Exchanges Overview */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">My Active Skill Swaps</h3>
                  <p className="text-xs text-slate-500">Track mutual progress and milestones</p>
                </div>
              </div>
              <Link
                to="/exchanges"
                className="text-xs font-bold text-[#5865F2] dark:text-[#818CF8] hover:underline"
              >
                Manage All Swaps →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {userActiveExchanges.slice(0, 2).map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#5865F2]/10 text-[#5865F2]">
                      {ex.status === 'in_progress' ? 'In Progress' : 'Accepted'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {ex.sessionsCompleted}/{ex.sessionsTarget} Sessions Done
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-normal">You Teach:</div>
                      <div className="text-[#5865F2]">{ex.requesterOfferedSkill}</div>
                    </div>
                    <Repeat className="w-4 h-4 text-slate-400" />
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-normal">You Learn:</div>
                      <div className="text-[#8B5CF6]">{ex.partnerOfferedSkill}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] rounded-full"
                      style={{
                        width: `${Math.round((ex.sessionsCompleted / ex.sessionsTarget) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Challenges */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Weekly Community Challenges</h3>
                  <p className="text-xs text-slate-500">Earn bonus XP to level up your avatar</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {weeklyChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{ch.title}</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        +{ch.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{ch.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {ch.currentCount}/{ch.targetCount} {ch.unit}
                    </span>
                    {ch.completed ? (
                      <span className="block text-[10px] text-emerald-500 font-bold">✓ Completed</span>
                    ) : (
                      <span className="block text-[10px] text-slate-400">{ch.expiresInDays}d left</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Peers & Badges Shelf */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recommended Study Partners */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5865F2]" />
                Recommended Partners
              </h3>
              <Link to="/matches" className="text-xs text-[#5865F2] font-semibold hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {recommendedPeers.map((peer) => (
                <div
                  key={peer.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {peer.name}
                      </div>
                      <div className="text-[11px] text-[#5865F2] truncate font-medium">
                        Teaches: {peer.skillsToTeach[0]?.name || 'Tech'}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/matches"
                    className="px-3 py-1.5 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] dark:text-[#818CF8] text-[11px] font-bold shrink-0 transition-colors"
                  >
                    Match
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Showcase */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Unlocked Badges ({userBadges.length})
              </h3>
              <Link to="/gamification" className="text-xs text-[#5865F2] font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {userBadges.slice(0, 4).map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center space-y-1"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center font-bold text-sm">
                    🏆
                  </div>
                  <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                    {badge.name}
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold">+{badge.xpReward} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Assistant Callout */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#8B5CF6]/15 via-[#5865F2]/15 to-transparent border border-[#5865F2]/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5865F2] dark:text-[#818CF8]">
              <Sparkles className="w-4 h-4" />
              <span>SphereAI Quick Quiz</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Ready for a quick 2-minute knowledge check?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Generate an interactive 4-question quiz on any topic to test your recall and score +100 XP.
            </p>
            <Link
              to="/ai-assistant"
              className="inline-block w-full py-2.5 rounded-xl bg-[#5865F2] text-white text-xs font-bold text-center hover:bg-[#4752C4] shadow-sm transition-colors"
            >
              Start AI Quiz Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
