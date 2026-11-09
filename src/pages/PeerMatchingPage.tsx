import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Heart,
  Star,
  ShieldCheck,
  Repeat,
  Send,
  X,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserProfile, SkillLevel } from '../types';
import { SKILL_CATEGORIES } from '../data/mockData';

export const PeerMatchingPage: React.FC = () => {
  const { currentUser, users } = useAuth();
  const {
    favoritePeerIds,
    toggleFavoritePeer,
    proposeExchange,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'weekdays' | 'weekends' | 'evenings'>('all');
  const [minRating, setMinRating] = useState<number>(0);

  // Modals state
  const [selectedPeer, setSelectedPeer] = useState<UserProfile | null>(null);
  const [exchangePeer, setExchangePeer] = useState<UserProfile | null>(null);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [targetSkill, setTargetSkill] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [sessionsTarget, setSessionsTarget] = useState(3);
  const [requestSent, setRequestSent] = useState(false);

  // Filter peers excluding current user
  const filteredPeers = useMemo(() => {
    return users.filter((peer) => {
      if (peer.id === currentUser?.id) return false;
      if (peer.status === 'suspended') return false;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const nameMatch = peer.name.toLowerCase().includes(query);
        const headlineMatch = peer.headline.toLowerCase().includes(query);
        const teachMatch = peer.skillsToTeach.some((s) => s.name.toLowerCase().includes(query));
        const learnMatch = peer.skillsToLearn.some((s) => s.name.toLowerCase().includes(query));
        if (!nameMatch && !headlineMatch && !teachMatch && !learnMatch) return false;
      }

      // Category match
      if (selectedCategory !== 'all') {
        const catObj = SKILL_CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj) {
          const hasCat = peer.skillsToTeach.some((s) => s.category.toLowerCase().includes(catObj.name.toLowerCase()));
          if (!hasCat) return false;
        }
      }

      // Skill Level
      if (selectedLevel !== 'all') {
        const hasLevel = peer.skillsToTeach.some((s) => s.level.toLowerCase() === selectedLevel.toLowerCase());
        if (!hasLevel) return false;
      }

      // Availability
      if (availabilityFilter === 'weekdays' && !peer.availability.weekdays) return false;
      if (availabilityFilter === 'weekends' && !peer.availability.weekends) return false;
      if (availabilityFilter === 'evenings' && !peer.availability.evenings) return false;

      // Rating
      if (minRating > 0 && peer.rating < minRating) return false;

      return true;
    });
  }, [users, currentUser, searchQuery, selectedCategory, selectedLevel, availabilityFilter, minRating]);

  // Compatibility algorithm calculation
  const calculateMatchScore = (peer: UserProfile) => {
    if (!currentUser) return 75;
    let score = 65;

    // Direct overlap: peer teaches what user wants to learn
    const userWants = currentUser.skillsToLearn.map((s) => s.name.toLowerCase());
    const peerTeaches = peer.skillsToTeach.map((s) => s.name.toLowerCase());
    const mutualTeach = peerTeaches.some((pt) => userWants.some((uw) => pt.includes(uw) || uw.includes(pt)));
    if (mutualTeach) score += 20;

    // Reverse overlap: user teaches what peer wants to learn
    const userTeaches = currentUser.skillsToTeach.map((s) => s.name.toLowerCase());
    const peerWants = peer.skillsToLearn.map((s) => s.name.toLowerCase());
    const mutualLearn = userTeaches.some((ut) => peerWants.some((pw) => ut.includes(pw) || pw.includes(ut)));
    if (mutualLearn) score += 12;

    // Rating boost
    if (peer.rating >= 4.9) score += 3;

    return Math.min(99, score);
  };

  const handleOpenExchangeModal = (peer: UserProfile) => {
    setExchangePeer(peer);
    setTargetSkill(peer.skillsToTeach[0]?.name || '');
    setOfferedSkill(currentUser?.skillsToTeach[0]?.name || 'Web Development');
    setProposalMessage(
      `Hi ${peer.name}! I would love to learn ${peer.skillsToTeach[0]?.name || 'your skill'} and can gladly teach you ${currentUser?.skillsToTeach[0]?.name || 'my skill'} in exchange.`
    );
    setRequestSent(false);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangePeer) return;

    proposeExchange(
      exchangePeer.id,
      targetSkill,
      offeredSkill,
      proposalMessage,
      sessionsTarget
    );

    setRequestSent(true);
    setTimeout(() => {
      setExchangePeer(null);
      setRequestSent(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Matching Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Your Ideal Peer Learning Partner
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Search students by skills, compare compatibility scores based on mutual teaching offers, and send 100% cashless skill swap proposals.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill (e.g. React, PyTorch, Figma, Spanish), name, or interest..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            >
              <option value="all">All Categories</option>
              {SKILL_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Minimum Proficiency
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            >
              <option value="all">Any Proficiency</option>
              <option value="intermediate">Intermediate & Above</option>
              <option value="advanced">Advanced Only</option>
              <option value="expert">Expert Only</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability
            </label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            >
              <option value="all">Flexible Times</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings (Post 5 PM)</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">⭐ 4.5 & Above</option>
              <option value="4.8">⭐ 4.8 & Above</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filteredPeers.length} available peer mentors</span>
        {favoritePeerIds.length > 0 && (
          <span className="text-amber-500 font-semibold">
            ⭐ {favoritePeerIds.length} peers bookmarked
          </span>
        )}
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeers.map((peer) => {
          const matchScore = calculateMatchScore(peer);
          const isFavorite = favoritePeerIds.includes(peer.id);

          return (
            <div
              key={peer.id}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              <div>
                {/* Header: Avatar, Info, Favorite Button */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#5865F2]/20"
                    />
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                        {peer.name}
                        {peer.isVerified && <ShieldCheck className="w-4 h-4 text-[#5865F2]" />}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{peer.headline}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavoritePeer(peer.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Bookmark peer"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Match Score Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{matchScore}% Compatibility Match</span>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {peer.bio}
                </p>

                {/* Teachable Skills */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Can Teach:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsToTeach.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#5865F2]/10 text-[#5865F2] dark:text-[#818CF8]"
                      >
                        {s.name} <span className="text-[10px] opacity-75">({s.level})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wants to learn */}
                {peer.skillsToLearn.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Wants to Learn:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {peer.skillsToLearn.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Rating, Detail View & Request Swap */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{peer.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400 font-normal">({peer.reviewsCount})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPeer(peer)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleOpenExchangeModal(peer)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 shadow-md flex items-center gap-1"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Swap</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: DETAILED PEER PROFILE */}
      {selectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPeer.avatar}
                  alt={selectedPeer.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#5865F2]"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedPeer.name}
                    {selectedPeer.isVerified && <ShieldCheck className="w-5 h-5 text-[#5865F2]" />}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedPeer.headline}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedPeer.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPeer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedPeer.bio}
              </p>
            </div>

            {/* Skills Teaches */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5865F2]">
                Teachable Skills & Experience
              </h4>
              <div className="space-y-2">
                {selectedPeer.skillsToTeach.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                      <span className="text-slate-400 ml-2">({s.category})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-semibold bg-[#5865F2]/10 text-[#5865F2]">
                      {s.level} ({s.yearsOfExperience || 1}+ yrs)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Wants */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                Target Skills to Learn
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPeer.skillsToLearn.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium"
                  >
                    {s.name} ({s.level})
                  </span>
                ))}
              </div>
            </div>

            {/* Availability info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#5865F2]" />
                Weekly Availability: ~{selectedPeer.availability.hoursPerWeek} hours/week
              </div>
              <p className="text-slate-500">
                {selectedPeer.availability.weekdays ? '✓ Weekdays ' : ''}
                {selectedPeer.availability.weekends ? '✓ Weekends ' : ''}
                {selectedPeer.availability.evenings ? '✓ Evenings' : ''}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPeer(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPeer(null);
                  handleOpenExchangeModal(selectedPeer);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                Propose Skill Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PROPOSE SKILL EXCHANGE */}
      {exchangePeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-[#5865F2]" />
                  Propose Cashless Skill Exchange
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Partner: <span className="font-semibold text-slate-800 dark:text-slate-200">{exchangePeer.name}</span>
                </p>
              </div>
              <button
                onClick={() => setExchangePeer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Proposal Sent!</h4>
                <p className="text-xs text-slate-500">
                  {exchangePeer.name} has been notified. You earned +50 XP for initiating a peer match!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4 text-xs">
                {/* 1. Offered Skill */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Skill you will teach {exchangePeer.name}:
                  </label>
                  <select
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                  >
                    {currentUser?.skillsToTeach.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.level})
                      </option>
                    ))}
                    <option value="General Web Development">General Web Development</option>
                    <option value="Introductory Python">Introductory Python</option>
                  </select>
                </div>

                {/* 2. Target Skill */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Skill you want to learn from {exchangePeer.name}:
                  </label>
                  <select
                    value={targetSkill}
                    onChange={(e) => setTargetSkill(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                  >
                    {exchangePeer.skillsToTeach.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.level})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Number of Sessions Target */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Target Live Study Sessions (1 hr each):
                  </label>
                  <div className="flex gap-3">
                    {[2, 3, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSessionsTarget(num)}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                          sessionsTarget === num
                            ? 'bg-[#5865F2] text-white border-[#5865F2]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {num} Sessions
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Message */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Personalized Message / Learning Goals:
                  </label>
                  <textarea
                    rows={3}
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setExchangePeer(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white font-bold shadow-md hover:opacity-95 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Proposal (Free)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

