import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Repeat,
  Video,
  Users,
  Award,
  Star,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ShieldCheck,
  Zap,
  BookOpen,
  Code2,
  Brain,
  Palette,
  Languages,
  MessageSquare,
  Bot
} from 'lucide-react';
import {
  SKILL_CATEGORIES,
  COMMUNITY_STATS,
  TESTIMONIALS,
  FAQ_ITEMS
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { users } = useAuth();
  const { sessions } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const popularTutors = users.filter((u) => u.rating >= 4.8).slice(0, 3);
  const upcomingSessions = sessions.filter((s) => s.status !== 'cancelled').slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#5865F2]/20 via-[#8B5CF6]/20 to-[#22D3EE]/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] dark:text-[#818CF8] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:4s]" />
                <span>Next-Gen Peer-To-Peer Learning</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Learn Together.{' '}
                <span className="bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                  Teach Together.
                </span>{' '}
                Succeed Together.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with motivated students around the world. Exchange knowledge 100% cashless, practice in live collaborative rooms, and master new skills with your personalized AI copilot.
              </p>

              {/* Tagline Callout */}
              <div className="font-semibold text-sm text-[#5865F2] dark:text-[#818CF8] flex items-center justify-center lg:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5865F2]"></span>
                <span>Your Skills. Their Knowledge. Our Community.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/matches"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white font-bold text-sm shadow-xl shadow-[#5865F2]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore Skills</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-card text-slate-800 dark:text-slate-100 font-bold text-sm hover:border-[#5865F2]/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-[#5865F2]" />
                  <span>Get Started Free</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Cashless Barter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5865F2]" />
                  <span>Verified Peers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Live Video & Code Rooms</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Animated Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Floating Skill Badge 1 */}
                <div className="absolute -top-6 -left-6 z-20 glass-card p-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce [animation-duration:3s]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5865F2] to-[#22D3EE] flex items-center justify-center text-white">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">React ⇄ Python</div>
                    <div className="text-[10px] text-emerald-500 font-semibold">98% Match Score</div>
                  </div>
                </div>

                {/* Floating Skill Badge 2 */}
                <div className="absolute -bottom-6 -right-6 z-20 glass-card p-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xs">
                    ⭐ 5.0
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Dr. Maya Patel</div>
                    <div className="text-[10px] text-slate-400">42 Peer Exchanges Completed</div>
                  </div>
                </div>

                {/* Main Hero Card Container */}
                <div className="rounded-3xl glass-card p-6 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-5">
                  {/* Card Header: Live Exchange Simulation */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Live Skill Swap
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] font-semibold">
                      Zero Fees
                    </span>
                  </div>

                  {/* Student A & Student B Exchange Visualization */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Alex Chen"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5865F2]"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Alex Chen</div>
                          <div className="text-[11px] text-[#5865F2] font-medium">Teaches: React & TypeScript</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#5865F2]/10 text-[#5865F2]">
                        Offer
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white flex items-center justify-center shadow-md">
                        <Repeat className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                          alt="Liam Vance"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B5CF6]"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Liam Vance</div>
                          <div className="text-[11px] text-[#8B5CF6] font-medium">Teaches: Figma & UX Systems</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                        Receive
                      </span>
                    </div>
                  </div>

                  {/* Interactive Mini Action */}
                  <div className="pt-2">
                    <Link
                      to="/live-room"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Study Room Demo</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE COMMUNITY STATS COUNTER */}
      <section className="py-8 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {COMMUNITY_STATS.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{stat.label}</div>
                <div className="text-[11px] text-[#5865F2] dark:text-[#818CF8] font-medium">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SKILLS & CATEGORIES */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
              Limitless Topics
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore What Students Are Exchanging Today
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Choose from hundreds of academic and career-ready skills taught by passionate peers.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                  activeCategory === cat.id
                    ? 'border-[#5865F2] bg-[#5865F2]/5 dark:bg-[#5865F2]/10 shadow-md ring-1 ring-[#5865F2]'
                    : 'border-slate-200 dark:border-slate-800 glass-card hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5865F2] to-[#8B5CF6] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-500">120+ active tutors</div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/matches"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#5865F2] dark:text-[#818CF8] hover:underline"
            >
              <span>View all 80+ peer skills and match directly</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. POPULAR PEER TUTORS */}
      <section className="py-16 bg-slate-50/70 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
                Top Rated Mentors
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Learn from Highly Endorsed Peers
              </h3>
            </div>
            <Link
              to="/matches"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#5865F2] dark:text-[#818CF8] bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors flex items-center gap-1.5"
            >
              Browse All Tutors
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#5865F2]/30"
                    />
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({tutor.reviewsCount})</span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    {tutor.name}
                    {tutor.isVerified && <ShieldCheck className="w-4 h-4 text-[#5865F2]" />}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">{tutor.headline}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {tutor.bio}
                  </p>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Can Teach:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.skillsToTeach.slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#5865F2]/10 text-[#5865F2] dark:text-[#818CF8]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Lvl {tutor.level} Scholar</span>
                  <Link
                    to="/matches"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-sm transition-colors"
                  >
                    Request Swap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRENDING SESSIONS */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
                Real-Time Learning
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Upcoming Live Peer Sessions
              </h3>
            </div>
            <Link
              to="/live-room"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] hover:opacity-95 shadow-md flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              Join Live Rooms
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {session.status === 'live' && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    HAPPENING NOW
                  </span>
                )}

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {session.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                    {session.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={session.tutorAvatar}
                      alt={session.tutorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{session.tutorName}</div>
                      <div className="text-[10px] text-slate-400">Host & Tutor</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#5865F2]" />
                    <span>{session.scheduledTime}</span>
                  </div>
                  <Link
                    to="/live-room"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-sm transition-colors"
                  >
                    {session.status === 'live' ? 'Enter Room' : 'RSVP Free'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-16 sm:py-24 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
              Seamless Workflow
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How SkillSphere Works in 4 Steps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Empowering students to share their expertise without financial barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center mx-auto font-black text-lg">
                1
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Create Your Profile</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add the skills you are passionate to teach and the skills you dream of learning.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mx-auto font-black text-lg">
                2
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Smart Matchmaking</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our algorithm discovers peers with complementary skills, time availability, and mutual goals.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center mx-auto font-black text-lg">
                3
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">100% Cashless Swap</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Schedule live interactive video sessions with real-time whiteboards and live code editors.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto font-black text-lg">
                4
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Level Up & Earn XP</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Collect achievement badges, maintain daily streaks, and climb community leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STUDENT SUCCESS STORIES */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
              Real Impact
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Loved by Students Across 60+ Campuses
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-[11px] font-bold">
                    {t.tag}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</h5>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5865F2] dark:text-[#818CF8]">
              Got Questions?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-[#5865F2]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaqIndex === idx ? 'rotate-180 text-[#5865F2]' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white text-center shadow-2xl overflow-hidden space-y-6">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Learn and Teach With Peers?
            </h3>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Join thousands of curious students exchanging skills today. No credit card, no subscription, 100% mutual growth.
            </p>
            <div className="pt-2">
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Find Your Study Partner Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

