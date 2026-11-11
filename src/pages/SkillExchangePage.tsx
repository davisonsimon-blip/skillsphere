import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Calendar,
  MessageSquare,
  Star,
  ChevronRight,
  BookOpen,
  ArrowRightLeft,
  X,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SkillExchange, ExchangeStatus, SkillLevel } from '../types';
import { Link } from 'react-router-dom';
import { CertificateModal } from '../components/common/CertificateModal';

export const SkillExchangePage: React.FC = () => {
  const { currentUser, addTeachableSkill, addLearnableSkill, removeSkill } = useAuth();
  const {
    exchanges,
    updateExchangeStatus,
    recordSessionForExchange,
    setActiveLiveRoomId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'pending' | 'completed'>('all');

  // Certificate Modal State
  const [certData, setCertData] = useState<{
    isOpen: boolean;
    learnerName: string;
    tutorName: string;
    skillName: string;
    sessionsCompleted: number;
  }>({
    isOpen: false,
    learnerName: '',
    tutorName: '',
    skillName: '',
    sessionsCompleted: 0,
  });

  // New Skill Modals
  const [isAddTeachOpen, setIsAddTeachOpen] = useState(false);
  const [teachSkillName, setTeachSkillName] = useState('');
  const [teachCategory, setTeachCategory] = useState('Web Development');
  const [teachLevel, setTeachLevel] = useState<SkillLevel>('Intermediate');
  const [teachYears, setTeachYears] = useState(2);

  const [isAddLearnOpen, setIsAddLearnOpen] = useState(false);
  const [learnSkillName, setLearnSkillName] = useState('');
  const [learnCategory, setLearnCategory] = useState('AI & Data Science');
  const [learnLevel, setLearnLevel] = useState<SkillLevel>('Beginner');

  // Filter exchanges
  const filteredExchanges = exchanges.filter((ex) => {
    if (activeTab === 'all') return true;
    return ex.status === activeTab;
  });

  const handleAddTeachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachSkillName.trim()) return;
    addTeachableSkill({
      name: teachSkillName.trim(),
      category: teachCategory,
      level: teachLevel,
      yearsOfExperience: teachYears,
    });
    setTeachSkillName('');
    setIsAddTeachOpen(false);
  };

  const handleAddLearnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnSkillName.trim()) return;
    addLearnableSkill({
      name: learnSkillName.trim(),
      category: learnCategory,
      level: learnLevel,
    });
    setLearnSkillName('');
    setIsAddLearnOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Concept Explainer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold uppercase tracking-wider">
            <Repeat className="w-3.5 h-3.5" />
            <span>100% Cashless Knowledge Barter</span>
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill Exchange Hub
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Trade what you know for what you want to master. Zero monetary transactions—pure peer-to-peer reciprocity.
          </p>
          {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

        <Link
          to="/matches"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white font-bold text-xs shadow-lg shadow-[#5865F2]/25 hover:opacity-95 flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose New Swap</span>
        </Link>
        {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

      {/* 2. My Inventory: Skills I Teach vs Skills I Learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teachable Skills Box */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Skills You Teach</h3>
                <p className="text-xs text-slate-500">Offered in your barter portfolio</p>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
            <button
              onClick={() => setIsAddTeachOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] dark:text-[#818CF8] text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

          <div className="space-y-2.5 pt-1">
            {currentUser?.skillsToTeach.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                You haven't listed any teachable skills yet. Add one to unlock exchanges!
              </p>
            ) : (
              currentUser?.skillsToTeach.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-slate-400 ml-2">({s.category})</span>
                    <div className="text-[11px] text-[#5865F2] mt-0.5">
                      {s.level} • {s.yearsOfExperience || 1}+ yrs experience
                      {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                    {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                  <button
                    onClick={() => removeSkill(s.id, 'teach')}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              ))
            )}
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

        {/* Learnable Skills Box */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Skills You Want to Learn</h3>
                <p className="text-xs text-slate-500">Matching algorithm seeks peers for these</p>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
            <button
              onClick={() => setIsAddLearnOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Target
            </button>
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

          <div className="space-y-2.5 pt-1">
            {currentUser?.skillsToLearn.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No learning goals added yet. Add a skill you wish to pick up!
              </p>
            ) : (
              currentUser?.skillsToLearn.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                    <span className="text-slate-400 ml-2">({s.category})</span>
                    <div className="text-[11px] text-[#8B5CF6] mt-0.5">
                      Target Level: {s.level}
                      {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                    {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                  <button
                    onClick={() => removeSkill(s.id, 'learn')}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              ))
            )}
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
        {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Exchanges ({exchanges.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'in_progress'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          In Progress ({exchanges.filter((e) => e.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'pending'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Pending Requests ({exchanges.filter((e) => e.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#5865F2] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed ({exchanges.filter((e) => e.status === 'completed').length})
        </button>
        {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

      {/* 4. Exchanges List */}
      <div className="space-y-4">
        {filteredExchanges.map((ex) => {
          const isUserRequester = ex.requesterId === currentUser?.id;
          const partnerName = isUserRequester ? ex.partnerName : ex.requesterName;
          const partnerAvatar = isUserRequester ? ex.partnerAvatar : ex.requesterAvatar;
          const youTeach = isUserRequester ? ex.requesterOfferedSkill : ex.partnerOfferedSkill;
          const youLearn = isUserRequester ? ex.partnerOfferedSkill : ex.requesterOfferedSkill;

          return (
            <div
              key={ex.id}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4"
            >
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5865F2]/20"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Swap with {partnerName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Initiated {new Date(ex.createdAt).toLocaleDateString()}
                    </p>
                    {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      ex.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : ex.status === 'in_progress'
                        ? 'bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20'
                        : ex.status === 'accepted'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {ex.status.replace('_', ' ')}
                  </span>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              {/* Skills Exchange Visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    You Provide:
                  </span>
                  <div className="text-sm font-extrabold text-[#5865F2]">{youTeach}</div>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center font-bold">
                    ⇄
                    {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

                <div className="space-y-0.5 text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    You Receive:
                  </span>
                  <div className="text-sm font-extrabold text-[#8B5CF6]">{youLearn}</div>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              {/* Message Note */}
              {ex.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{ex.message}"
                </p>
              )}

              {/* Progress & Milestone Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Completed Sessions</span>
                  <span>
                    {ex.sessionsCompleted} of {ex.sessionsTarget} ({Math.round((ex.sessionsCompleted / ex.sessionsTarget) * 100)}%)
                  </span>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-emerald-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (ex.sessionsCompleted / ex.sessionsTarget) * 100)}%`,
                    }}
                  ></div>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                {ex.status === 'pending' && !isUserRequester && (
                  <>
                    <button
                      onClick={() => updateExchangeStatus(ex.id, 'declined')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => updateExchangeStatus(ex.id, 'accepted')}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      Accept Swap
                    </button>
                  </>
                )}

                {(ex.status === 'accepted' || ex.status === 'in_progress') && (
                  <>
                    <button
                      onClick={() => recordSessionForExchange(ex.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Log Session Done (+150 XP)</span>
                    </button>
                    <Link
                      to="/live-room"
                      onClick={() => setActiveLiveRoomId('room-alpha-ml')}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold shadow-md hover:opacity-95"
                    >
                      Open Live Study Room
                    </Link>
                  </>
                )}

                {ex.status === 'completed' && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed! (+300 XP)</span>
                      {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                    <button
                      onClick={() =>
                        setCertData({
                          isOpen: true,
                          learnerName: isUserRequester ? ex.requesterName : ex.partnerName,
                          tutorName: isUserRequester ? ex.partnerName : ex.requesterName,
                          skillName: youLearn,
                          sessionsCompleted: ex.sessionsCompleted,
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>View Credential</span>
                    </button>
                    {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                )}
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
              {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          );
        })}
        {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

      {/* MODAL: ADD TEACHABLE SKILL */}
      {isAddTeachOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Skill You Can Teach
              </h3>
              <button
                onClick={() => setIsAddTeachOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
              {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

            <form onSubmit={handleAddTeachSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Conversational Japanese, Blender 3D..."
                  value={teachSkillName}
                  onChange={(e) => setTeachSkillName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                />
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={teachCategory}
                  onChange={(e) => setTeachCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="Languages & Linguistics">Languages & Linguistics</option>
                  <option value="Business & Startup">Business & Startup</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proficiency
                  </label>
                  <select
                    value={teachLevel}
                    onChange={(e) => setTeachLevel(e.target.value as SkillLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Years Exp.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={teachYears}
                    onChange={(e) => setTeachYears(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeachOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4]"
                >
                  Save Skill
                </button>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
            </form>
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
      )}

      {/* MODAL: ADD LEARNABLE SKILL */}
      {isAddLearnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Skill You Want to Learn
              </h3>
              <button
                onClick={() => setIsAddLearnOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
              {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

            <form onSubmit={handleAddLearnSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch Machine Learning, Rust, Figma..."
                  value={learnSkillName}
                  onChange={(e) => setLearnSkillName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={learnCategory}
                  onChange={(e) => setLearnCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="Languages & Linguistics">Languages & Linguistics</option>
                  <option value="Business & Startup">Business & Startup</option>
                </select>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Proficiency
                </label>
                <select
                  value={learnLevel}
                  onChange={(e) => setLearnLevel(e.target.value as SkillLevel)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner (Start from Scratch)</option>
                  <option value="Intermediate">Intermediate (Project Ready)</option>
                  <option value="Advanced">Advanced (Production Mastery)</option>
                </select>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLearnOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6] text-white font-bold hover:bg-[#7C3AED]"
                >
                  Save Goal
                </button>
                {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
            </form>
            {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
          {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
      )}
      {/* MODAL: CERTIFICATE OF COMPLETION */}
      <CertificateModal
        isOpen={certData.isOpen}
        onClose={() => setCertData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certData.learnerName}
        tutorName={certData.tutorName}
        skillName={certData.skillName}
        sessionsCompleted={certData.sessionsCompleted}
      />
    </div>
  );
};

