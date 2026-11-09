import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Compass,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const AIAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'quiz' | 'roadmap'>('chat');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "👋 Hi! I'm SphereAI, your personal peer-learning copilot. Ask me to explain a tricky concept, generate an interactive quiz, or recommend study topics!",
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { activeQuiz, generateQuizForTopic, answerQuizQuestion, resetQuiz } = useApp();
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('react') || lower.includes('hook') || lower.includes('state')) {
        reply = `💡 **React Hooks Breakdown:**\n\n- \`useState\`: Manages reactive state within functional components.\n- \`useEffect\`: Synchronizes your component with external systems (APIs, WebSockets, DOM).\n- \`useMemo\` & \`useCallback\`: Cache computed values and function references between re-renders.\n\n*Pro-tip for Peer Sessions:* Pair with Alex Chen in the Live Room to walk through custom hooks together!`;
      } else if (lower.includes('python') || lower.includes('ai') || lower.includes('machine learning')) {
        reply = `🧠 **AI & Machine Learning Roadmap Tip:**\n\nStart by mastering NumPy matrix manipulation and PyTorch tensors. Check out Dr. Maya Patel's upcoming session in the Live Room on 'PyTorch Tensors & Linear Regression Deep Dive'!`;
      } else if (lower.includes('figma') || lower.includes('design') || lower.includes('ui')) {
        reply = `🎨 **UI/UX Best Practice:**\n\nAlways use 8pt grid spacing and auto-layout with min/max width constraints. You can propose a skill exchange with Liam Vance to review your Figma component tokens!`;
      } else {
        reply = `✨ **SphereAI Insight on "${userText}":**\n\nPeer-to-peer collaboration accelerates mastery of this topic by 3.5x! Try explaining this concept out loud to a study partner using our Live Whiteboard. Would you like me to generate a 4-question quiz on this topic to test your recall?`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleStartQuiz = (topic: string) => {
    setMode('quiz');
    setQuizFeedback(null);
    generateQuizForTopic(topic || 'Modern Web Development');
  };

  const handleAnswer = (optionIdx: number) => {
    const res = answerQuizQuestion(optionIdx);
    setQuizFeedback(res);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white shadow-xl shadow-[#5865F2]/30 hover:scale-105 hover:shadow-2xl transition-all duration-200 group"
        aria-label="Open AI Learning Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        </div>
        <span className="font-bold text-sm tracking-wide hidden sm:inline">SphereAI</span>
      </button>

      {/* Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:pr-6 sm:pb-6 bg-black/40 backdrop-blur-xs">
          <div className="w-full sm:w-[440px] h-[85vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#5865F2]/10 via-[#8B5CF6]/10 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5865F2] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    SphereAI Assistant
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      Online
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    24/7 Peer Learning & Concept Copilot
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/ai-assistant"
                  onClick={() => setIsOpen(false)}
                  title="Open Fullscreen Studio"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Tabs */}
            <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => {
                  setMode('chat');
                  resetQuiz();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors ${
                  mode === 'chat'
                    ? 'bg-white dark:bg-slate-800 text-[#5865F2] dark:text-[#818CF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Chat
              </button>
              <button
                onClick={() => handleStartQuiz('Web Architecture & React')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors ${
                  mode === 'quiz'
                    ? 'bg-white dark:bg-slate-800 text-[#5865F2] dark:text-[#818CF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                AI Quiz
              </button>
              <button
                onClick={() => {
                  setMode('roadmap');
                  resetQuiz();
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors ${
                  mode === 'roadmap'
                    ? 'bg-white dark:bg-slate-800 text-[#5865F2] dark:text-[#818CF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Roadmap
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mode === 'chat' && (
                <>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white rounded-br-none shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5865F2] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-1 text-[11px]">SphereAI is thinking...</span>
                    </div>
                  )}
                </>
              )}

              {mode === 'quiz' && activeQuiz && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question {activeQuiz.currentQuestionIndex + 1} of {activeQuiz.questions.length}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5865F2]/10 text-[#5865F2]">
                      Score: {activeQuiz.score}
                    </span>
                  </div>

                  {!activeQuiz.completed ? (
                    <div className="space-y-3">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        {activeQuiz.questions[activeQuiz.currentQuestionIndex].question}
                      </p>

                      <div className="space-y-2 pt-2">
                        {activeQuiz.questions[activeQuiz.currentQuestionIndex].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#5865F2] dark:hover:border-[#818CF8] hover:bg-[#5865F2]/5 dark:hover:bg-[#5865F2]/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <span className="inline-block w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-center font-bold text-[10px] mr-2 leading-5">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>

                      {quizFeedback && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                            quizFeedback.isCorrect
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {quizFeedback.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold">
                              {quizFeedback.isCorrect ? 'Correct! (+25 XP)' : 'Not quite right'}
                            </div>
                            <div className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                              {quizFeedback.explanation}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center font-black text-2xl">
                        {activeQuiz.score}/{activeQuiz.questions.length}
                      </div>
                      <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
                        Quiz Completed!
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        You scored {activeQuiz.score} out of {activeQuiz.questions.length}. XP points have been added to your profile!
                      </p>
                      <button
                        onClick={() => handleStartQuiz('Next.js Fullstack & APIs')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2] text-white text-xs font-semibold hover:bg-[#4752C4]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Try Another Topic
                      </button>
                    </div>
                  )}
                </div>
              )}

              {mode === 'roadmap' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                    <span className="font-bold text-purple-700 dark:text-purple-300 block mb-1">
                      🗺️ AI Recommended 4-Week Study Plan
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Based on your current goal: Full-Stack React & AI Integration.
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-[#5865F2]">Week 1: Fundamentals & Typing</div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Master TypeScript generics, discriminated unions, and React 19 hooks lifecycle.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-[#8B5CF6]">Week 2: Peer Collaborative Projects</div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Schedule 2 live sessions with Liam Vance for Figma design component reviews.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-[#22D3EE]">Week 3: Real-Time WebSockets</div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Implement bidirectional messaging, whiteboards, and state synchronization.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-bold text-emerald-500">Week 4: AI Copilot Endpoints</div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Integrate vector search, LLM streaming, and automated evaluation tests.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer for Chat Mode */}
            {mode === 'chat' && (
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question, request a concept explanation..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-40 text-white transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

