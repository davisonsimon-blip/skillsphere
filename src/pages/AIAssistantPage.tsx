import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  BrainCircuit,
  Compass,
  FileText,
  Users,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const AIAssistantPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    activeQuiz,
    generateQuizForTopic,
    answerQuizQuestion,
    resetQuiz,
    addXP,
  } = useApp();

  const [activeTool, setActiveTool] = useState<'explainer' | 'quiz' | 'roadmap' | 'summarizer'>('explainer');

  // Explainer State
  const [conceptTopic, setConceptTopic] = useState('');
  const [complexity, setComplexity] = useState<'eli5' | 'beginner' | 'technical'>('beginner');
  const [explanationResult, setExplanationResult] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Quiz Input State
  const [customQuizTopic, setCustomQuizTopic] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  // Roadmap State
  const [targetSkill, setTargetSkill] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('5 hours/week');
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Summarizer State
  const [rawText, setRawText] = useState('');
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Handle Explainer
  const handleExplain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptTopic.trim()) return;

    setIsExplaining(true);
    setExplanationResult(null);

    setTimeout(() => {
      setIsExplaining(false);
      const topic = conceptTopic.trim();

      if (complexity === 'eli5') {
        setExplanationResult(
          `🎈 **Explain Like I'm 5: ${topic}**\n\nImagine you have a giant toy box. Instead of throwing all the toys into one big pile on the floor where no one can find anything, you have neat little compartments with clear picture labels.\n\nThat is what **${topic}** does! It keeps your tools organized and talks nicely to other parts so everyone can play together without tripping over each other's toys.`
        );
      } else if (complexity === 'technical') {
        setExplanationResult(
          `⚡ **Technical Architectural Breakdown: ${topic}**\n\n1. **Core Mechanism:** Operates as a declarative state machine using immutable primitives and unidirectional data flow.\n2. **Time Complexity:** O(1) amortized lookup via hash indexing; avoids quadratic re-render cascades through memoization heuristics.\n3. **Concurrency & Thread Safety:** Utilizes atomic transaction boundaries to ensure zero race conditions during asynchronous dispatch.`
        );
      } else {
        setExplanationResult(
          `📘 **Beginner Friendly Overview: ${topic}**\n\n**What it is:** A cornerstone concept in modern software development and engineering that simplifies building scalable applications.\n\n**Why it matters:** Without it, developers write redundant code and struggle to maintain state across different screens.\n\n**Key Takeaways:**\n- Modular design allows rapid testing.\n- Easy to pair program with fellow peers on SkillSphere!\n- Practice in the Live Room whiteboard to solidify your understanding.`
        );
      }
      addXP(25, 'Studying concepts with AI');
    }, 700);
  };

  // Handle Quiz Start
  const handleStartCustomQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuizTopic.trim()) return;
    setQuizFeedback(null);
    generateQuizForTopic(customQuizTopic.trim());
  };

  const handleSelectQuizOption = (idx: number) => {
    const feedback = answerQuizQuestion(idx);
    setQuizFeedback(feedback);
  };

  // Handle Roadmap
  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSkill.trim()) return;

    setIsGeneratingRoadmap(true);
    setGeneratedRoadmap(null);

    setTimeout(() => {
      setIsGeneratingRoadmap(false);
      setGeneratedRoadmap({
        skill: targetSkill.trim(),
        weeks: [
          {
            week: 1,
            title: 'Foundational Theory & Environment Setup',
            description: `Set up local developer tooling, install dependencies, and master core syntax.`,
            milestone: 'Build a hello-world CLI or test suite',
          },
          {
            week: 2,
            title: 'Hands-on Peer Pairing & Core Patterns',
            description: `Schedule a 1-to-1 session with a SkillSphere peer to review code architecture.`,
            milestone: 'Create a multi-component interactive prototype',
          },
          {
            week: 3,
            title: 'State Synchronization & Error Handling',
            description: `Implement persistent storage, form validation, and robust boundary recovery.`,
            milestone: 'Deploy a functional MVP to staging',
          },
          {
            week: 4,
            title: 'Portfolio Showcase & Community Teaching',
            description: `Teach this skill to a junior student on SkillSphere to cement your mastery!`,
            milestone: 'Receive your first 5-star peer tutor endorsement',
          },
        ],
      });
      addXP(50, 'Generated Personalized AI Roadmap');
    }, 800);
  };

  // Handle Summarizer
  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsSummarizing(true);
    setSummaryResult(null);

    setTimeout(() => {
      setIsSummarizing(false);
      setSummaryResult(`📋 **Executive Summary & Key Takeaways:**\n\n• **Core Thesis:** The author emphasizes that active peer-to-peer teaching yields superior retention compared to passive lecture viewing.\n• **Key Finding:** Explaining concepts out loud reveals cognitive blind spots in real time.\n• **Recommended Action:** Schedule weekly peer code reviews and use spaced repetition quizzes.`);
      addXP(30, 'Summarized Study Material');
    }, 750);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-xs font-bold uppercase tracking-wider">
          <Bot className="w-3.5 h-3.5" />
          <span>24/7 AI Learning Copilot</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SphereAI Learning Studio
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Accelerate your peer learning with personalized concept breakdowns, dynamic quizzes with instant XP rewards, and customized study roadmaps.
        </p>
      </div>

      {/* 2. Superpower Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTool('explainer')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTool === 'explainer'
              ? 'border-[#5865F2] bg-[#5865F2]/10 ring-2 ring-[#5865F2]'
              : 'glass-card border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#5865F2] mb-2" />
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Concept Explainer
          </div>
          <p className="text-[11px] text-slate-500">ELI5 to Technical</p>
        </button>

        <button
          onClick={() => setActiveTool('quiz')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTool === 'quiz'
              ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 ring-2 ring-[#8B5CF6]'
              : 'glass-card border-slate-200 dark:border-slate-800'
          }`}
        >
          <BrainCircuit className="w-5 h-5 text-[#8B5CF6] mb-2" />
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Dynamic AI Quiz
          </div>
          <p className="text-[11px] text-slate-500">Test Recall & Earn XP</p>
        </button>

        <button
          onClick={() => setActiveTool('roadmap')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTool === 'roadmap'
              ? 'border-[#22D3EE] bg-[#22D3EE]/10 ring-2 ring-[#22D3EE]'
              : 'glass-card border-slate-200 dark:border-slate-800'
          }`}
        >
          <Compass className="w-5 h-5 text-[#22D3EE] mb-2" />
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Study Roadmap
          </div>
          <p className="text-[11px] text-slate-500">4-Week Structured Plan</p>
        </button>

        <button
          onClick={() => setActiveTool('summarizer')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTool === 'summarizer'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
              : 'glass-card border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="w-5 h-5 text-emerald-500 mb-2" />
          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            Note Summarizer
          </div>
          <p className="text-[11px] text-slate-500">Paste Any Article or Notes</p>
        </button>
      </div>

      {/* 3. TOOL 1: CONCEPT EXPLAINER */}
      {activeTool === 'explainer' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5865F2]" />
              Smart Concept Explainer
            </h3>
            <p className="text-xs text-slate-500">
              Break down any difficult academic or technical concept tailored to your preferred depth.
            </p>
          </div>

          <form onSubmit={handleExplain} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                What concept would you like explained?
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Backpropagation in Neural Nets, React 19 Concurrent Mode, CSS Grid subgrid, Docker containers..."
                value={conceptTopic}
                onChange={(e) => setConceptTopic(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Choose Tone & Complexity:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'eli5', label: '🧸 Explain Like I’m 5', sub: 'Simple analogies' },
                  { id: 'beginner', label: '🎓 Beginner Student', sub: 'Clear & practical' },
                  { id: 'technical', label: '⚡ Deep Technical', sub: 'Under-the-hood systems' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setComplexity(t.id as any)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      complexity === t.id
                        ? 'border-[#5865F2] bg-[#5865F2]/10 text-[#5865F2]'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{t.label}</div>
                    <div className="text-[10px] text-slate-400">{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isExplaining}
                className="px-6 py-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isExplaining ? 'Generating Breakdown...' : 'Explain Concept (+25 XP)'}</span>
              </button>
            </div>
          </form>

          {explanationResult && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-300">
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {explanationResult}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Ready to test what you learned?
                </span>
                <button
                  onClick={() => {
                    setActiveTool('quiz');
                    generateQuizForTopic(conceptTopic || 'AI & Computer Science');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold shadow-sm"
                >
                  Generate Quiz on this Topic →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TOOL 2: DYNAMIC AI QUIZ GENERATOR */}
      {activeTool === 'quiz' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />
              Interactive AI Quiz Generator
            </h3>
            <p className="text-xs text-slate-500">
              Challenge yourself with dynamic 4-choice questions. Score 3+ correct to unlock badges and +100 XP!
            </p>
          </div>

          {!activeQuiz ? (
            <form onSubmit={handleStartCustomQuiz} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Enter Quiz Topic:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. PyTorch Tensors, React Hooks, UI Wireframing, Spanish Grammar..."
                    value={customQuizTopic}
                    onChange={(e) => setCustomQuizTopic(e.target.value)}
                    className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-md"
                  >
                    Generate Quiz
                  </button>
                </div>
              </div>

              {/* Suggested Topics Pills */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Topics:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['React & WebSockets', 'PyTorch Machine Learning', 'Figma Auto-Layout', 'Cyber Security Basics'].map(
                    (top) => (
                      <button
                        key={top}
                        type="button"
                        onClick={() => {
                          setCustomQuizTopic(top);
                          generateQuizForTopic(top);
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#8B5CF6]/10 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                      >
                        {top}
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Topic: {activeQuiz.topic}
                  </span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Question {activeQuiz.currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold text-xs">
                    Current Score: {activeQuiz.score}
                  </span>
                </div>
              </div>

              {!activeQuiz.completed ? (
                <div className="space-y-4">
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {activeQuiz.questions[activeQuiz.currentQuestionIndex].question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeQuiz.questions[activeQuiz.currentQuestionIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectQuizOption(i)}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 dark:hover:bg-[#8B5CF6]/10 text-left text-xs font-medium text-slate-800 dark:text-slate-200 transition-all flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-center font-bold text-xs shrink-0 leading-6">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    ))}
                  </div>

                  {quizFeedback && (
                    <div
                      className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
                        quizFeedback.isCorrect
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {quizFeedback.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {quizFeedback.isCorrect ? 'Correct! (+25 XP)' : 'Incorrect'}
                        </div>
                        <p className="mt-1 leading-relaxed">{quizFeedback.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center font-black text-3xl">
                    {activeQuiz.score}/{activeQuiz.questions.length}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                    Quiz Finished!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Great effort! You answered {activeQuiz.score} correctly. Review this topic with your peers in the Live Room!
                  </p>
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold hover:bg-[#7C3AED]"
                  >
                    Take Another Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. TOOL 3: STUDY ROADMAP GENERATOR */}
      {activeTool === 'roadmap' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#22D3EE]" />
              Personalized 4-Week Learning Roadmap
            </h3>
            <p className="text-xs text-slate-500">
              Get an actionable, week-by-week curriculum integrating SkillSphere peer sessions.
            </p>
          </div>

          <form onSubmit={handleGenerateRoadmap} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill to Master
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Next.js 15, Machine Learning, UI/UX Design..."
                  value={targetSkill}
                  onChange={(e) => setTargetSkill(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Study Commitment
                </label>
                <select
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="3 hours/week">Casual: 3 hours/week</option>
                  <option value="6 hours/week">Recommended: 6 hours/week (2 peer swaps)</option>
                  <option value="12 hours/week">Intensive: 12 hours/week</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGeneratingRoadmap}
                className="px-6 py-3 rounded-2xl bg-[#22D3EE] hover:bg-[#06B6D4] text-slate-950 font-bold text-xs shadow-md"
              >
                {isGeneratingRoadmap ? 'Crafting Roadmap...' : 'Generate Roadmap (+50 XP)'}
              </button>
            </div>
          </form>

          {generatedRoadmap && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Curriculum for: {generatedRoadmap.skill}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedRoadmap.weeks.map((w: any) => (
                  <div
                    key={w.week}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#22D3EE]/15 text-[#0891B2] dark:text-[#22D3EE]">
                        Week {w.week}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{w.title}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {w.description}
                    </p>
                    <div className="pt-2 text-[11px] font-semibold text-[#5865F2]">
                      🎯 Milestone: {w.milestone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TOOL 4: NOTE SUMMARIZER */}
      {activeTool === 'summarizer' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Study Material & Article Summarizer
            </h3>
            <p className="text-xs text-slate-500">
              Paste lecture notes, documentation, or articles for high-retention bullet points.
            </p>
          </div>

          <form onSubmit={handleSummarize} className="space-y-4 text-xs">
            <textarea
              rows={5}
              required
              placeholder="Paste notes, transcripts, or academic text here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSummarizing}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                {isSummarizing ? 'Summarizing...' : 'Summarize Text (+30 XP)'}
              </button>
            </div>
          </form>

          {summaryResult && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in">
              {summaryResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

