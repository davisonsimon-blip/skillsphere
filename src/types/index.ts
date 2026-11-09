export type UserRole = 'learner' | 'tutor' | 'both' | 'admin';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserSkill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  yearsOfExperience?: number;
  endorsements?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  headline: string;
  bio: string;
  location: string;
  timezone: string;
  rating: number;
  reviewsCount: number;
  skillsToTeach: UserSkill[];
  skillsToLearn: UserSkill[];
  availability: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    evenings: boolean;
    hoursPerWeek: number;
  };
  socials?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  xp: number;
  level: number;
  streakDays: number;
  badges: string[];
  isVerified?: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';

export interface SkillExchange {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterOfferedSkill: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerOfferedSkill: string;
  message: string;
  status: ExchangeStatus;
  sessionsTarget: number;
  sessionsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSession {
  id: string;
  title: string;
  description: string;
  skillName: string;
  category: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  learnerId: string;
  learnerName: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  meetingRoomId: string;
  isGroupSession?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isAcceptedSolution?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  createdAt: string;
  upvotes: number;
  hasAcceptedAnswer: boolean;
  commentsCount: number;
  comments: ForumComment[];
  views: number;
  isBookmarked?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'exchange_request' | 'exchange_accepted' | 'session_reminder' | 'badge_unlocked' | 'forum_reply' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'teaching' | 'community' | 'streaks';
  xpReward: number;
  unlockedAt?: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  targetCount: number;
  currentCount: number;
  unit: string;
  expiresInDays: number;
  completed: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  xp: number;
  level: number;
  streakDays: number;
  rank: number;
  sessionsCompleted: number;
}

export interface ReportedItem {
  id: string;
  targetId: string;
  targetType: 'forum_post' | 'comment' | 'user';
  targetTitle: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

