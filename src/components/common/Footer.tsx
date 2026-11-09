import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Share2, Heart, Mail, CheckCircle2, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0B0F19]/80 backdrop-blur-md pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-md shadow-[#5865F2]/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                SkillSphere
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Learn Together, Grow Together.
              </span>{' '}
              The modern peer-to-peer learning ecosystem empowering students to teach what they know, exchange skills cashless, and level up with AI copilot.
            </p>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              "Your Skills. Their Knowledge. Our Community."
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="GitHub"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/matches" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Find Study Peers
                </Link>
              </li>
              <li>
                <Link to="/exchanges" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Skill Exchange Barter
                </Link>
              </li>
              <li>
                <Link to="/live-room" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Live Collab Rooms
                </Link>
              </li>
              <li>
                <Link to="/forum" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Community Q&A Forum
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  SphereAI Copilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Gamification & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/gamification" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Leaderboard & XP
                </Link>
              </li>
              <li>
                <Link to="/gamification" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Achievement Badges
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#5865F2] dark:hover:text-[#818CF8] transition-colors">
                  Safety & Moderation
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get weekly study tips, featured peer tutors, and community challenge alerts.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the list! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter student email..."
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] hover:opacity-95 shadow-sm transition-all"
                >
                  Join Community
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} SkillSphere Inc. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for curious learners worldwide.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400">Peer-to-Peer Learning Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
