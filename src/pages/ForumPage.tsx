import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  Bookmark,
  CheckCircle2,
  Flag,
  Share2,
  Filter,
  Eye,
  Sparkles,
  Send,
  X,
  MessageCircle,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ForumPost } from '../types';
import { SKILL_CATEGORIES } from '../data/mockData';

export const ForumPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    posts,
    createPost,
    addComment,
    upvotePost,
    upvoteComment,
    markAcceptedSolution,
    toggleBookmarkPost,
    reportContent,
  } = useApp();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'upvotes' | 'unanswered'>('latest');

  // Selected Post for Detail View Modal
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Ask Question Modal
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState('Web Development');
  const [questionTags, setQuestionTags] = useState('React, TypeScript');

  // Report Modal
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string } | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Filtered & Sorted Posts
  const filteredPosts = posts
    .filter((post) => {
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const titleMatch = post.title.toLowerCase().includes(q);
        const contentMatch = post.content.toLowerCase().includes(q);
        const tagMatch = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !contentMatch && !tagMatch) return false;
      }
      if (sortBy === 'unanswered' && post.commentsCount > 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      return 0; // default order
    });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionContent.trim()) return;

    const tagsArray = questionTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createPost(questionTitle.trim(), questionContent.trim(), questionCategory, tagsArray);

    setQuestionTitle('');
    setQuestionContent('');
    setIsAskModalOpen(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentText.trim()) return;

    addComment(selectedPost.id, newCommentText.trim());
    setNewCommentText('');

    // Update selected post view locally
    const updated = posts.find((p) => p.id === selectedPost.id);
    if (updated) setSelectedPost(updated);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget || !reportReason.trim()) return;

    reportContent(reportTarget.id, 'forum_post', reportTarget.title, reportReason.trim());
    setReportTarget(null);
    setReportReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Ask Question CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Peer Knowledge Exchange Forum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Community Discussions & Q&A
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Stuck on a tricky bug or concept? Ask your fellow learners and peer tutors. Answers marked as accepted solutions earn bonus XP points!
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white font-bold text-xs shadow-lg shadow-[#5865F2]/25 hover:opacity-95 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question (+40 XP)</span>
        </button>
      </div>

      {/* 2. Search & Categories Toolbar */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions by topic, question, or tag (e.g. WebSockets, PyTorch, Figma)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
          />
        </div>

        {/* Categories Pills & Sort Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Web Development', 'AI & Data Science', 'UI/UX & Product Design', 'Cyber Security'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#5865F2] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="latest">Latest Discussions</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Questions List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-500 text-xs space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-400" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No discussions match your filter</p>
            <p>Be the first student to post a question in this category!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-[#5865F2]/40 transition-all cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#5865F2]/10 text-[#5865F2]">
                    {post.category}
                  </span>
                  {post.hasAcceptedAnswer && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Solved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Posted by {post.authorName}</span>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#5865F2] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer Row: Upvotes, Comments, Bookmark, Report */}
              <div
                className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => upvotePost(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#5865F2]/10 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#5865F2] transition-colors font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} answers</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmarkPost(post.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#5865F2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Bookmark"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#5865F2] text-[#5865F2]' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => setReportTarget({ id: post.id, title: post.title })}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Report"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: VIEW POST & ANSWERS THREAD */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#5865F2]/10 text-[#5865F2]">
                  {selectedPost.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Asked by {selectedPost.authorName}</span>
                  <span>•</span>
                  <span>{selectedPost.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </div>

            {/* Answers Section */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedPost.comments.length} Community Answers</span>
              </h4>

              <div className="space-y-3">
                {selectedPost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-2xl border space-y-2 text-xs ${
                      comment.isAcceptedSolution
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">({comment.authorRole})</span>
                      </div>

                      {comment.isAcceptedSolution && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Accepted Solution
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => upvoteComment(selectedPost.id, comment.id)}
                        className="flex items-center gap-1 font-bold text-slate-500 hover:text-[#5865F2]"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.upvotes}</span>
                      </button>

                      {/* Author can mark as accepted solution */}
                      {!selectedPost.hasAcceptedAnswer && (
                        <button
                          onClick={() => markAcceptedSolution(selectedPost.id, comment.id)}
                          className="text-[#5865F2] dark:text-[#818CF8] font-bold hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark as Accepted Solution (+100 XP)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit New Answer */}
            <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2">
              <label className="font-bold text-xs text-slate-700 dark:text-slate-300">
                Your Answer / Explanation:
              </label>
              <textarea
                rows={3}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your code snippet or explanation to help your peer..."
                required
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Answer (+30 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASK NEW QUESTION */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5865F2]" />
                Ask the Peer Community
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to prevent memory leaks in React 19 WebSocket listeners?"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="General Learning">General Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, PyTorch, Node"
                    value={questionTags}
                    onChange={(e) => setQuestionTags(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation / Code:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what you tried, what error occurred, and include code blocks..."
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4]"
                >
                  Publish Question (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REPORT CONTENT */}
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-rose-600 flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Report Inappropriate Content
            </h3>
            <p className="text-xs text-slate-500">
              Target: <span className="font-semibold text-slate-800 dark:text-slate-200">{reportTarget.title}</span>
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Report:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe why this content violates community guidelines (spam, harassment, academic dishonesty)..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

