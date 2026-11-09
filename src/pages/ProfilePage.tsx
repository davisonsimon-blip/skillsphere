import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Clock,
  Globe,
  Calendar,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Plus,
  Trash2,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BADGES_LIST } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [timezone, setTimezone] = useState(currentUser?.timezone || '');
  const [github, setGithub] = useState(currentUser?.socials?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.socials?.linkedin || '');
  const [portfolio, setPortfolio] = useState(currentUser?.socials?.portfolio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      headline,
      bio,
      location,
      timezone,
      socials: {
        github,
        linkedin,
        portfolio,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const userBadges = BADGES_LIST.filter((b) => currentUser.badges.includes(b.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#5865F2]/20 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500">{currentUser.headline}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] font-bold text-[10px] uppercase">
                  Level {currentUser.level} Scholar
                </span>
                <span>•</span>
                <span>⭐ {currentUser.rating.toFixed(1)} ({currentUser.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-2xl font-black text-[#5865F2] dark:text-[#818CF8]">
              {currentUser.xp.toLocaleString()} XP
            </span>
            <span className="block text-[11px] text-slate-400 font-semibold">
              {currentUser.streakDays} Day Streak 🔥
            </span>
          </div>
        </div>
      </div>

      {/* 2. Edit Profile Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-[#5865F2]" />
          Edit Profile Information
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Headline / Role
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              About Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Portfolio Website
              </label>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : (
              <span></span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow-md transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. Badges Collection Showcase */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          My Badges Collection ({userBadges.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {userBadges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center space-y-1"
            >
              <div className="text-2xl">🏆</div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
