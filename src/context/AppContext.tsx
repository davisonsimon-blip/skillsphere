import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SkillExchange,
  LearningSession,
  ForumPost,
  ForumComment,
  NotificationItem,
  WeeklyChallenge,
  ReportedItem,
  QuizQuestion,
  ExchangeStatus,
} from '../types';
import {
  INITIAL_EXCHANGES,
  INITIAL_SESSIONS,
  INITIAL_FORUM_POSTS,
  WEEKLY_CHALLENGES,
  INITIAL_REPORTS,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { triggerConfetti, triggerLevelUpConfetti } from '../utils/confetti';

interface AppContextType {
  // Exchanges
  exchanges: SkillExchange[];
  proposeExchange: (partnerId: string, partnerSkill: string, offeredSkill: string, message: string, sessionsTarget?: number) => void;
  updateExchangeStatus: (exchangeId: string, status: ExchangeStatus) => void;
  recordSessionForExchange: (exchangeId: string) => void;

  // Sessions
  sessions: LearningSession[];
  scheduleSession: (session: Omit<LearningSession, 'id' | 'meetingRoomId' | 'status'>) => void;
  cancelSession: (sessionId: string) => void;
  activeLiveRoomId: string | null;
  setActiveLiveRoomId: (roomId: string | null) => void;

  // Forum
  posts: ForumPost[];
  createPost: (title: string, content: string, category: string, tags: string[]) => void;
  addComment: (postId: string, content: string) => void;
  upvotePost: (postId: string) => void;
  upvoteComment: (postId: string, commentId: string) => void;
  markAcceptedSolution: (postId: string, commentId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  deletePost: (postId: string) => void;

  // Favorites
  favoritePeerIds: string[];
  toggleFavoritePeer: (peerId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // Gamification
  weeklyChallenges: WeeklyChallenge[];
  addXP: (amount: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;

  // Admin & Moderation
  reports: ReportedItem[];
  reportContent: (targetId: string, targetType: 'forum_post' | 'comment' | 'user', targetTitle: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'resolve' | 'dismiss') => void;
  systemAnnouncement: string | null;
  setSystemAnnouncement: (msg: string | null) => void;

  // AI Assistant State
  activeQuiz: {
    topic: string;
    questions: QuizQuestion[];
    currentQuestionIndex: number;
    score: number;
    completed: boolean;
  } | null;
  generateQuizForTopic: (topic: string) => void;
  answerQuizQuestion: (selectedOptionIndex: number) => { isCorrect: boolean; explanation: string };
  resetQuiz: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile, users } = useAuth();

  // Load from localStorage or mock
  const [exchanges, setExchanges] = useState<SkillExchange[]>(() => {
    const saved = localStorage.getItem('skillsphere_exchanges');
    return saved ? JSON.parse(saved) : INITIAL_EXCHANGES;
  });

  const [sessions, setSessions] = useState<LearningSession[]>(() => {
    const saved = localStorage.getItem('skillsphere_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('skillsphere_posts');
    return saved ? JSON.parse(saved) : INITIAL_FORUM_POSTS;
  });

  const [favoritePeerIds, setFavoritePeerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('skillsphere_favorites');
    return saved ? JSON.parse(saved) : ['user-maya'];
  });

  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>(() => {
    const saved = localStorage.getItem('skillsphere_challenges');
    return saved ? JSON.parse(saved) : WEEKLY_CHALLENGES;
  });

  const [reports, setReports] = useState<ReportedItem[]>(() => {
    const saved = localStorage.getItem('skillsphere_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('skillsphere_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'n1',
            userId: 'user-current',
            type: 'exchange_request',
            title: 'New Skill Exchange Offer!',
            message: 'Liam Vance accepted your Figma UI/UX exchange proposal.',
            link: '/exchanges',
            isRead: false,
            createdAt: '15 mins ago',
          },
          {
            id: 'n2',
            userId: 'user-current',
            type: 'session_reminder',
            title: 'Live Session Starting Soon',
            message: 'PyTorch Tensors session with Dr. Maya Patel is starting in 30 minutes.',
            link: '/live-room',
            isRead: false,
            createdAt: '1 hour ago',
          },
        ];
  });

  const [activeLiveRoomId, setActiveLiveRoomId] = useState<string | null>('room-alpha-ml');
  const [systemAnnouncement, setSystemAnnouncement] = useState<string | null>(
    '🚀 Welcome to SkillSphere v2.0! Exchange your knowledge with university peers today completely free.'
  );

  const [activeQuiz, setActiveQuiz] = useState<{
    topic: string;
    questions: QuizQuestion[];
    currentQuestionIndex: number;
    score: number;
    completed: boolean;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skillsphere_exchanges', JSON.stringify(exchanges));
  }, [exchanges]);

  useEffect(() => {
    localStorage.setItem('skillsphere_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('skillsphere_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('skillsphere_favorites', JSON.stringify(favoritePeerIds));
  }, [favoritePeerIds]);

  useEffect(() => {
    localStorage.setItem('skillsphere_challenges', JSON.stringify(weeklyChallenges));
  }, [weeklyChallenges]);

  useEffect(() => {
    localStorage.setItem('skillsphere_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('skillsphere_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Gamification: Add XP & check levels
  const addXP = (amount: number, reason: string) => {
    if (!currentUser) return;
    const oldXP = currentUser.xp;
    const newXP = oldXP + amount;
    const oldLevel = currentUser.level;
    const newLevel = Math.floor(newXP / 1000) + 1;

    updateProfile({
      xp: newXP,
      level: newLevel,
    });

    if (newLevel > oldLevel) {
      triggerLevelUpConfetti();
      addNotification({
        userId: currentUser.id,
        type: 'badge_unlocked',
        title: 'Level Up! 🌟',
        message: `Congratulations! You reached Level ${newLevel} (${reason})!`,
        link: '/gamification',
      });
    } else {
      triggerConfetti();
    }
  };

  const unlockBadge = (badgeId: string) => {
    if (!currentUser) return;
    if (!currentUser.badges.includes(badgeId)) {
      updateProfile({
        badges: [...currentUser.badges, badgeId],
      });
      triggerLevelUpConfetti();
      addNotification({
        userId: currentUser.id,
        type: 'badge_unlocked',
        title: 'New Achievement Unlocked! 🏆',
        message: `You earned a new badge! Check your trophy shelf.`,
        link: '/gamification',
      });
    }
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  // Exchanges
  const proposeExchange = (
    partnerId: string,
    partnerSkill: string,
    offeredSkill: string,
    message: string,
    sessionsTarget: number = 3
  ) => {
    if (!currentUser) return;
    const partner = users.find((u) => u.id === partnerId);
    if (!partner) return;

    const newExchange: SkillExchange = {
      id: `ex-${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterOfferedSkill: offeredSkill,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerAvatar: partner.avatar,
      partnerOfferedSkill: partnerSkill,
      message,
      status: 'pending',
      sessionsTarget,
      sessionsCompleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExchanges((prev) => [newExchange, ...prev]);
    addXP(50, 'Proposing a Skill Exchange');
    unlockBadge('b1'); // First match badge
  };

  const updateExchangeStatus = (exchangeId: string, status: ExchangeStatus) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === exchangeId ? { ...ex, status, updatedAt: new Date().toISOString() } : ex
      )
    );

    if (status === 'accepted') {
      addXP(100, 'Skill Exchange Accepted');
    } else if (status === 'completed') {
      addXP(300, 'Skill Exchange Completed');
      unlockBadge('b2');
    }
  };

  const recordSessionForExchange = (exchangeId: string) => {
    setExchanges((prev) =>
      prev.map((ex) => {
        if (ex.id === exchangeId) {
          const nextCompleted = ex.sessionsCompleted + 1;
          const isDone = nextCompleted >= ex.sessionsTarget;
          return {
            ...ex,
            sessionsCompleted: nextCompleted,
            status: isDone ? 'completed' : 'in_progress',
            updatedAt: new Date().toISOString(),
          };
        }
        return ex;
      })
    );
    addXP(150, 'Completed a Peer Session');
  };

  // Sessions
  const scheduleSession = (
    sessionData: Omit<LearningSession, 'id' | 'meetingRoomId' | 'status'>
  ) => {
    const newSession: LearningSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
      meetingRoomId: `room-${Math.random().toString(36).substring(2, 9)}`,
      status: 'upcoming',
    };
    setSessions((prev) => [newSession, ...prev]);
    addXP(50, 'Scheduling Learning Session');
  };

  const cancelSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s))
    );
  };

  // Forum
  const createPost = (title: string, content: string, category: string, tags: string[]) => {
    if (!currentUser) return;
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      category,
      tags,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'tutor' ? 'Peer Tutor' : 'Learner',
      createdAt: 'Just now',
      upvotes: 1,
      hasAcceptedAnswer: false,
      commentsCount: 0,
      comments: [],
      views: 1,
    };
    setPosts((prev) => [newPost, ...prev]);
    addXP(40, 'Sharing question with community');
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    const newComment: ForumComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role === 'tutor' ? 'Peer Tutor' : 'Learner',
      content,
      createdAt: 'Just now',
      upvotes: 0,
      isAcceptedSolution: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
    addXP(30, 'Helping a peer on the forum');
  };

  const upvotePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const upvoteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map((c) =>
              c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
            ),
          };
        }
        return p;
      })
    );
  };

  const markAcceptedSolution = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            hasAcceptedAnswer: true,
            comments: p.comments.map((c) => ({
              ...c,
              isAcceptedSolution: c.id === commentId,
            })),
          };
        }
        return p;
      })
    );
    addXP(100, 'Author Accepted Your Solution');
    unlockBadge('b8');
  };

  const toggleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Favorites
  const toggleFavoritePeer = (peerId: string) => {
    setFavoritePeerIds((prev) =>
      prev.includes(peerId) ? prev.filter((id) => id !== peerId) : [...prev, peerId]
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Reports
  const reportContent = (
    targetId: string,
    targetType: 'forum_post' | 'comment' | 'user',
    targetTitle: string,
    reason: string
  ) => {
    const newReport: ReportedItem = {
      id: `rep-${Date.now()}`,
      targetId,
      targetType,
      targetTitle,
      reportedBy: currentUser?.name || 'Anonymous',
      reason,
      createdAt: 'Just now',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
    alert('Thank you. Your report has been submitted to moderators for review.');
  };

  const resolveReport = (reportId: string, action: 'resolve' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r
      )
    );
  };

  // AI Quiz Generator
  const generateQuizForTopic = (topic: string) => {
    const sampleQuestions: Record<string, QuizQuestion[]> = {
      default: [
        {
          question: `In ${topic || 'Computer Science'}, what is the fundamental purpose of abstraction?`,
          options: [
            'Hiding implementation complexity and exposing a simplified interface',
            'Maximizing RAM usage for performance gains',
            'Converting source code directly into hardware microcode',
            'Preventing users from inspecting styling variables'
          ],
          correctAnswer: 0,
          explanation: 'Abstraction allows developers to work with high-level conceptual models without needing to manage low-level internal complexities.'
        },
        {
          question: `When collaborating with a peer tutor in ${topic || 'learning'}, what is the primary benefit of the Feynman technique?`,
          options: [
            'Memorizing formulas by repetitive rote rehearsal',
            'Explaining the topic in simple terms to identify gaps in your own understanding',
            'Passing standard tests without doing practical exercises',
            'Speed-reading textbooks in under ten minutes'
          ],
          correctAnswer: 1,
          explanation: 'The Feynman technique posits that if you cannot explain a concept to a beginner in simple language, you have gaps in your mental model.'
        },
        {
          question: `Which method is most effective for retaining complex skills in ${topic || 'peer study'}?`,
          options: [
            'Passive video watching at 2x speed',
            'Active recall, spaced repetition, and hands-on peer code review',
            'Cramming for 10 hours the night before',
            'Highlighting lines in PDF notes without testing oneself'
          ],
          correctAnswer: 1,
          explanation: 'Peer review and active recall build durable neural pathways and long-term memory far better than passive consumption.'
        },
        {
          question: `In modern development workflows for ${topic || 'applications'}, why are unit tests important?`,
          options: [
            'They replace documentation completely',
            'They guarantee your computer will not crash',
            'They catch regressions early and document intended behavior',
            'They make compile times faster'
          ],
          correctAnswer: 2,
          explanation: 'Automated tests protect your codebase against regression bugs when refactoring or adding new features.'
        }
      ]
    };

    setActiveQuiz({
      topic: topic || 'General Tech',
      questions: sampleQuestions.default,
      currentQuestionIndex: 0,
      score: 0,
      completed: false,
    });
  };

  const answerQuizQuestion = (selectedOptionIndex: number) => {
    if (!activeQuiz) return { isCorrect: false, explanation: '' };
    const currentQ = activeQuiz.questions[activeQuiz.currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQ.correctAnswer;
    const nextScore = isCorrect ? activeQuiz.score + 1 : activeQuiz.score;
    const isLast = activeQuiz.currentQuestionIndex >= activeQuiz.questions.length - 1;

    setActiveQuiz({
      ...activeQuiz,
      score: nextScore,
      currentQuestionIndex: isLast ? activeQuiz.currentQuestionIndex : activeQuiz.currentQuestionIndex + 1,
      completed: isLast,
    });

    if (isLast) {
      if (nextScore >= 3) {
        addXP(100, `Excelling in ${activeQuiz.topic} Quiz!`);
        unlockBadge('b6');
      } else {
        addXP(40, `Completing ${activeQuiz.topic} Quiz`);
      }
    }

    return {
      isCorrect,
      explanation: currentQ.explanation,
    };
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
  };

  return (
    <AppContext.Provider
      value={{
        exchanges,
        proposeExchange,
        updateExchangeStatus,
        recordSessionForExchange,
        sessions,
        scheduleSession,
        cancelSession,
        activeLiveRoomId,
        setActiveLiveRoomId,
        posts,
        createPost,
        addComment,
        upvotePost,
        upvoteComment,
        markAcceptedSolution,
        toggleBookmarkPost,
        deletePost,
        favoritePeerIds,
        toggleFavoritePeer,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        weeklyChallenges,
        addXP,
        unlockBadge,
        reports,
        reportContent,
        resolveReport,
        systemAnnouncement,
        setSystemAnnouncement,
        activeQuiz,
        generateQuizForTopic,
        answerQuizQuestion,
        resetQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

