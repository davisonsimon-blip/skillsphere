import {
  UserProfile,
  SkillExchange,
  LearningSession,
  ForumPost,
  AchievementBadge,
  WeeklyChallenge,
  LeaderboardUser,
  ReportedItem
} from '../types';

export const SKILL_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles', color: 'from-blue-500 to-indigo-500' },
  { id: 'web-dev', name: 'Web Development', icon: 'Code', color: 'from-blue-500 to-cyan-500' },
  { id: 'ai-ml', name: 'AI & Data Science', icon: 'Brain', color: 'from-purple-500 to-pink-500' },
  { id: 'ui-ux', name: 'UI/UX & Product Design', icon: 'Palette', color: 'from-pink-500 to-rose-500' },
  { id: 'mobile', name: 'Mobile App Dev', icon: 'Smartphone', color: 'from-amber-500 to-orange-500' },
  { id: 'languages', name: 'Languages & Linguistics', icon: 'Languages', color: 'from-emerald-500 to-teal-500' },
  { id: 'business', name: 'Business & Startup', icon: 'TrendingUp', color: 'from-violet-500 to-purple-500' },
  { id: 'security', name: 'Cyber Security', icon: 'ShieldCheck', color: 'from-cyan-500 to-blue-600' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-current',
    name: 'Alex Chen',
    email: 'alex.chen@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'both',
    headline: 'Computer Science Undergrad | React & TypeScript Fanatic',
    bio: 'Passionate about modern web technologies and frontend animations. Currently learning PyTorch & machine learning while helping fellow students master React, Tailwind, and Node.js.',
    location: 'San Francisco, CA (PST)',
    timezone: 'UTC-8',
    rating: 4.9,
    reviewsCount: 18,
    skillsToTeach: [
      { id: 's1', name: 'React.js', category: 'Web Development', level: 'Advanced', yearsOfExperience: 3, endorsements: 24 },
      { id: 's2', name: 'TypeScript', category: 'Web Development', level: 'Intermediate', yearsOfExperience: 2, endorsements: 19 },
      { id: 's3', name: 'Tailwind CSS', category: 'Web Development', level: 'Expert', yearsOfExperience: 3, endorsements: 31 },
    ],
    skillsToLearn: [
      { id: 'l1', name: 'Python Machine Learning', category: 'AI & Data Science', level: 'Beginner' },
      { id: 'l2', name: 'Figma UI/UX Design', category: 'UI/UX & Product Design', level: 'Beginner' },
      { id: 'l3', name: 'Docker & Kubernetes', category: 'DevOps', level: 'Intermediate' },
    ],
    availability: {
      weekdays: true,
      weekends: true,
      mornings: false,
      evenings: true,
      hoursPerWeek: 8,
    },
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: 'https://alexchen.dev',
    },
    xp: 2840,
    level: 4,
    streakDays: 7,
    badges: ['b1', 'b2', 'b3', 'b5', 'b8'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-maya',
    name: 'Dr. Maya Patel',
    email: 'maya.patel@skillsphere.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'tutor',
    headline: 'Senior AI Researcher & Python Data Specialist',
    bio: 'PhD in Cognitive Computing. Love explaining neural networks from first principles. Looking to pick up Rust and WebAssembly from talented systems enthusiasts.',
    location: 'Boston, MA (EST)',
    timezone: 'UTC-5',
    rating: 5.0,
    reviewsCount: 42,
    skillsToTeach: [
      { id: 's4', name: 'Python Machine Learning', category: 'AI & Data Science', level: 'Expert', yearsOfExperience: 6, endorsements: 56 },
      { id: 's5', name: 'Deep Learning (PyTorch)', category: 'AI & Data Science', level: 'Expert', yearsOfExperience: 5, endorsements: 48 },
      { id: 's6', name: 'Data Visualization (Pandas)', category: 'AI & Data Science', level: 'Advanced', yearsOfExperience: 5, endorsements: 39 },
    ],
    skillsToLearn: [
      { id: 'l4', name: 'Rust Programming', category: 'Web Development', level: 'Beginner' },
      { id: 'l5', name: 'Next.js 15 Fullstack', category: 'Web Development', level: 'Intermediate' },
    ],
    availability: {
      weekdays: true,
      weekends: false,
      mornings: true,
      evenings: true,
      hoursPerWeek: 10,
    },
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    xp: 6420,
    level: 7,
    streakDays: 24,
    badges: ['b1', 'b2', 'b4', 'b6', 'b7', 'b10'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'user-liam',
    name: 'Liam Vance',
    email: 'liam.vance@design.co',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'both',
    headline: 'Product Designer at FinTech | Design Systems Architect',
    bio: 'Obsessed with micro-interactions, accessibility, and high-fidelity Figma components. Want to learn React & React Native to build my own design prototypes.',
    location: 'London, UK (GMT)',
    timezone: 'UTC+0',
    rating: 4.8,
    reviewsCount: 29,
    skillsToTeach: [
      { id: 's7', name: 'Figma UI/UX Design', category: 'UI/UX & Product Design', level: 'Expert', yearsOfExperience: 4, endorsements: 43 },
      { id: 's8', name: 'Design Systems', category: 'UI/UX & Product Design', level: 'Advanced', yearsOfExperience: 3, endorsements: 35 },
      { id: 's9', name: 'User Research & Wireframing', category: 'UI/UX & Product Design', level: 'Advanced', yearsOfExperience: 4, endorsements: 28 },
    ],
    skillsToLearn: [
      { id: 'l6', name: 'React.js', category: 'Web Development', level: 'Beginner' },
      { id: 'l7', name: 'Tailwind CSS', category: 'Web Development', level: 'Intermediate' },
    ],
    availability: {
      weekdays: true,
      weekends: true,
      mornings: false,
      evenings: true,
      hoursPerWeek: 6,
    },
    socials: {
      portfolio: 'https://liamdesign.io',
      linkedin: 'https://linkedin.com',
    },
    xp: 4120,
    level: 5,
    streakDays: 12,
    badges: ['b1', 'b2', 'b3', 'b9'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'user-sofia',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@polyglot.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'both',
    headline: 'Native Spanish Instructor & Language Enthusiast',
    bio: 'Bilingual educator teaching conversational Spanish, grammar nuances, and cultural context. Excited to exchange lessons for Fullstack JavaScript or Python basics.',
    location: 'Madrid, Spain (CET)',
    timezone: 'UTC+1',
    rating: 4.95,
    reviewsCount: 36,
    skillsToTeach: [
      { id: 's10', name: 'Conversational Spanish', category: 'Languages & Linguistics', level: 'Expert', yearsOfExperience: 5, endorsements: 51 },
      { id: 's11', name: 'Business Spanish', category: 'Languages & Linguistics', level: 'Advanced', yearsOfExperience: 4, endorsements: 30 },
    ],
    skillsToLearn: [
      { id: 'l8', name: 'Python Basics', category: 'Web Development', level: 'Beginner' },
      { id: 'l9', name: 'Web Development', category: 'Web Development', level: 'Beginner' },
    ],
    availability: {
      weekdays: true,
      weekends: true,
      mornings: true,
      evenings: false,
      hoursPerWeek: 12,
    },
    xp: 5100,
    level: 6,
    streakDays: 19,
    badges: ['b1', 'b2', 'b4', 'b7'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Sarah Connor (Admin)',
    email: 'admin@skillsphere.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    headline: 'SkillSphere Platform Administrator & Community Lead',
    bio: 'Overseeing community integrity, peer safety, and platform moderation to keep SkillSphere a supportive peer learning environment.',
    location: 'Global / Remote',
    timezone: 'UTC+0',
    rating: 5.0,
    reviewsCount: 88,
    skillsToTeach: [
      { id: 's12', name: 'Community Building', category: 'Business & Startup', level: 'Expert', yearsOfExperience: 7 },
      { id: 's13', name: 'Full-Stack Architecture', category: 'Web Development', level: 'Expert', yearsOfExperience: 8 },
    ],
    skillsToLearn: [],
    availability: {
      weekdays: true,
      weekends: true,
      mornings: true,
      evenings: true,
      hoursPerWeek: 20,
    },
    xp: 9999,
    level: 10,
    streakDays: 140,
    badges: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-kenji',
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@tokyotech.jp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'tutor',
    headline: 'Cybersecurity Analyst & Penetration Tester',
    bio: 'Certified ethical hacker (CEH, OSCP). Teaching network defense, web security, and vulnerability scanning. Looking for peers to practice conversational German.',
    location: 'Tokyo, Japan (JST)',
    timezone: 'UTC+9',
    rating: 4.85,
    reviewsCount: 22,
    skillsToTeach: [
      { id: 's14', name: 'Ethical Hacking & Pen Testing', category: 'Cyber Security', level: 'Expert', yearsOfExperience: 4, endorsements: 33 },
      { id: 's15', name: 'Network Security', category: 'Cyber Security', level: 'Advanced', yearsOfExperience: 3, endorsements: 27 },
    ],
    skillsToLearn: [
      { id: 'l10', name: 'Conversational German', category: 'Languages & Linguistics', level: 'Beginner' },
    ],
    availability: {
      weekdays: false,
      weekends: true,
      mornings: true,
      evenings: true,
      hoursPerWeek: 6,
    },
    xp: 3450,
    level: 4,
    streakDays: 9,
    badges: ['b1', 'b2', 'b3'],
    isVerified: true,
    status: 'active',
    createdAt: '2026-09-10T12:00:00Z',
  }
];

export const INITIAL_EXCHANGES: SkillExchange[] = [
  {
    id: 'ex-1',
    requesterId: 'user-current',
    requesterName: 'Alex Chen',
    requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    requesterOfferedSkill: 'React.js',
    partnerId: 'user-maya',
    partnerName: 'Dr. Maya Patel',
    partnerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    partnerOfferedSkill: 'Python Machine Learning',
    message: 'Hi Dr. Maya! I’d love to teach you modern React component architecture & hooks in exchange for intro lessons in PyTorch and tensor ops!',
    status: 'in_progress',
    sessionsTarget: 4,
    sessionsCompleted: 2,
    createdAt: '2026-11-01T14:00:00Z',
    updatedAt: '2026-11-07T16:00:00Z',
  },
  {
    id: 'ex-2',
    requesterId: 'user-liam',
    requesterName: 'Liam Vance',
    requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    requesterOfferedSkill: 'Figma UI/UX Design',
    partnerId: 'user-current',
    partnerName: 'Alex Chen',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    partnerOfferedSkill: 'Tailwind CSS',
    message: 'Hey Alex! Saw your awesome Tailwind portfolio. I can teach you auto-layout and component variables in Figma if you help me master responsive CSS flexbox.',
    status: 'accepted',
    sessionsTarget: 3,
    sessionsCompleted: 0,
    createdAt: '2026-11-06T09:30:00Z',
    updatedAt: '2026-11-08T11:20:00Z',
  },
  {
    id: 'ex-3',
    requesterId: 'user-current',
    requesterName: 'Alex Chen',
    requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    requesterOfferedSkill: 'TypeScript',
    partnerId: 'user-sofia',
    partnerName: 'Sofia Rodriguez',
    partnerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    partnerOfferedSkill: 'Conversational Spanish',
    message: 'Hola Sofia! Would you like to exchange Spanish speaking practice for TypeScript basics?',
    status: 'pending',
    sessionsTarget: 4,
    sessionsCompleted: 0,
    createdAt: '2026-11-09T08:00:00Z',
    updatedAt: '2026-11-09T08:00:00Z',
  },
  {
    id: 'ex-4',
    requesterId: 'user-kenji',
    requesterName: 'Kenji Takahashi',
    requesterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    requesterOfferedSkill: 'Ethical Hacking & Pen Testing',
    partnerId: 'user-current',
    partnerName: 'Alex Chen',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    partnerOfferedSkill: 'React.js',
    message: 'Completed all 3 security audit and React frontend sessions. Thanks for an amazing exchange!',
    status: 'completed',
    sessionsTarget: 3,
    sessionsCompleted: 3,
    createdAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-28T18:00:00Z',
  }
];

export const INITIAL_SESSIONS: LearningSession[] = [
  {
    id: 'ses-1',
    title: 'PyTorch Tensors & Linear Regression Deep Dive',
    description: 'Hands-on session building your first neural network from scratch with Dr. Maya.',
    skillName: 'Python Machine Learning',
    category: 'AI & Data Science',
    tutorId: 'user-maya',
    tutorName: 'Dr. Maya Patel',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    learnerId: 'user-current',
    learnerName: 'Alex Chen',
    scheduledTime: 'Today at 6:30 PM',
    durationMinutes: 60,
    status: 'live',
    meetingRoomId: 'room-alpha-ml',
    isGroupSession: false,
  },
  {
    id: 'ses-2',
    title: 'Figma Auto-Layout & Design Tokens Workshop',
    description: 'Learn how modern UI designers structure tokens and responsive layouts.',
    skillName: 'Figma UI/UX Design',
    category: 'UI/UX & Product Design',
    tutorId: 'user-liam',
    tutorName: 'Liam Vance',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    learnerId: 'user-current',
    learnerName: 'Alex Chen',
    scheduledTime: 'Tomorrow at 4:00 PM',
    durationMinutes: 45,
    status: 'upcoming',
    meetingRoomId: 'room-figma-live',
    isGroupSession: false,
  },
  {
    id: 'ses-3',
    title: 'Open Community Study Lounge: React 19 & Server Actions',
    description: 'Collaborative coding room open for anyone learning Next.js 15 & React 19 concurrent mode.',
    skillName: 'React.js',
    category: 'Web Development',
    tutorId: 'user-current',
    tutorName: 'Alex Chen',
    tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    learnerId: 'group-community',
    learnerName: 'SkillSphere Community',
    scheduledTime: 'Wednesday at 8:00 PM',
    durationMinutes: 90,
    status: 'upcoming',
    meetingRoomId: 'room-react-lounge',
    isGroupSession: true,
    maxParticipants: 15,
    currentParticipants: 8,
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'How do you structure custom hooks in React 19 without memory leaks in WebSocket listeners?',
    content: `I am building a real-time collaborative whiteboard where two students draw simultaneously. When the user navigates between routes, the socket listener occasionally attaches multiple times. 

Here is my current hook code:
\`\`\`typescript
useEffect(() => {
  const socket = io(SERVER_URL);
  socket.on('draw-stroke', handleStroke);
  return () => {
    socket.off('draw-stroke', handleStroke);
    socket.disconnect();
  };
}, []);
\`\`\`
Is there a better way to ensure singleton socket lifecycle across component re-renders?`,
    category: 'Web Development',
    tags: ['React', 'WebSockets', 'TypeScript', 'CleanCode'],
    authorId: 'user-current',
    authorName: 'Alex Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Peer Tutor',
    createdAt: '2 hours ago',
    upvotes: 14,
    hasAcceptedAnswer: true,
    commentsCount: 3,
    views: 142,
    isBookmarked: true,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'user-maya',
        authorName: 'Dr. Maya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Senior Tutor',
        content: `Great question Alex! The cleanest pattern in React 18 & 19 is to lift the socket connection into a persistent React Context with a \`useRef\` or dedicated socket provider. That way you only connect once per user session, and individual components just subscribe via \`useEffect\` with proper cleanup!`,
        createdAt: '1 hour ago',
        upvotes: 9,
        isAcceptedSolution: true,
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'user-liam',
        authorName: 'Liam Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'UI/UX Lead',
        content: `Also make sure you debounce your pointer movement events before emitting over the socket, otherwise you will flood the pipeline with 120 packets per second!`,
        createdAt: '45 mins ago',
        upvotes: 5,
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Beginner Roadmap: Which Python libraries should I master first for Computer Vision?',
    content: `Hi everyone! I just started my peer learning journey in AI. I am confused whether I should start with OpenCV, PIL, or jump straight into torchvision with PyTorch datasets. Any advice from seasoned tutors?`,
    category: 'AI & Data Science',
    tags: ['Python', 'ComputerVision', 'OpenCV', 'PyTorch'],
    authorId: 'user-sofia',
    authorName: 'Sofia Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Learner',
    createdAt: 'Yesterday',
    upvotes: 21,
    hasAcceptedAnswer: false,
    commentsCount: 2,
    views: 289,
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'user-maya',
        authorName: 'Dr. Maya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Senior Tutor',
        content: `Start with OpenCV for 1-2 weeks to understand pixel matrix representations, color channels (BGR vs RGB), and convolution kernels. Once you have intuition for edge detection and filtering, transition directly into torchvision!`,
        createdAt: '20 hours ago',
        upvotes: 11,
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Figma best practices: Auto-layout vs manual frames for responsive dashboards',
    content: `When designing high-density cards for desktop and tablet screens, what is your go-to rule of thumb for min-width constraints in Figma 2026?`,
    category: 'UI/UX & Product Design',
    tags: ['Figma', 'AutoLayout', 'DesignSystems'],
    authorId: 'user-liam',
    authorName: 'Liam Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'UI/UX Lead',
    createdAt: '3 days ago',
    upvotes: 18,
    hasAcceptedAnswer: true,
    commentsCount: 4,
    views: 310,
    comments: []
  }
];

export const BADGES_LIST: AchievementBadge[] = [
  { id: 'b1', name: 'First Match', description: 'Initiated your first peer skill exchange', icon: 'Handshake', category: 'community', xpReward: 100 },
  { id: 'b2', name: 'Knowledge Seeker', description: 'Completed 5 live peer learning sessions', icon: 'BookOpen', category: 'learning', xpReward: 250 },
  { id: 'b3', name: 'Master Tutor', description: 'Received a 5-star rating for teaching a peer', icon: 'Award', category: 'teaching', xpReward: 300 },
  { id: 'b4', name: 'Streak Warrior', description: 'Maintained a 7-day continuous learning streak', icon: 'Flame', category: 'streaks', xpReward: 500 },
  { id: 'b5', name: 'Code Artisan', description: 'Shared code during 3 live collaborative sessions', icon: 'Code2', category: 'learning', xpReward: 200 },
  { id: 'b6', name: 'AI Scholar', description: 'Achieved a perfect score in 3 AI Assistant quizzes', icon: 'BrainCircuit', category: 'learning', xpReward: 350 },
  { id: 'b7', name: 'Polyglot Mind', description: 'Exchanged skills across 2 different categories', icon: 'Globe', category: 'community', xpReward: 400 },
  { id: 'b8', name: 'Solution Hero', description: 'Had an answer accepted as the official solution on the forum', icon: 'CheckCircle2', category: 'community', xpReward: 300 },
  { id: 'b9', name: 'Pixel Pioneer', description: 'Co-created a project using the Live Whiteboard', icon: 'Paintbrush', category: 'learning', xpReward: 200 },
  { id: 'b10', name: 'Mentor of the Month', description: 'Ranked in the top 5 community tutors', icon: 'Crown', category: 'teaching', xpReward: 1000 },
  { id: 'b11', name: 'Grandmaster', description: 'Reached platform Level 10 and 10,000 XP', icon: 'Sparkles', category: 'learning', xpReward: 2500 },
  { id: 'b12', name: 'Community Pillar', description: 'Active member for over 90 consecutive days', icon: 'Shield', category: 'community', xpReward: 1500 },
];

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'ch-1',
    title: 'Peer Power Hour',
    description: 'Complete at least 2 live study sessions with a peer this week',
    xpReward: 350,
    targetCount: 2,
    currentCount: 1,
    unit: 'sessions',
    expiresInDays: 3,
    completed: false,
  },
  {
    id: 'ch-2',
    title: 'Community Helper',
    description: 'Answer 2 questions in the Discussion Forum with helpful details',
    xpReward: 200,
    targetCount: 2,
    currentCount: 2,
    unit: 'answers',
    expiresInDays: 3,
    completed: true,
  },
  {
    id: 'ch-3',
    title: 'SphereAI Quiz Master',
    description: 'Generate and pass 3 quizzes with your AI Learning Assistant',
    xpReward: 300,
    targetCount: 3,
    currentCount: 2,
    unit: 'quizzes',
    expiresInDays: 4,
    completed: false,
  }
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  { id: 'user-maya', name: 'Dr. Maya Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', headline: 'Senior AI Researcher', xp: 6420, level: 7, streakDays: 24, rank: 1, sessionsCompleted: 42 },
  { id: 'user-sofia', name: 'Sofia Rodriguez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', headline: 'Language Specialist', xp: 5100, level: 6, streakDays: 19, rank: 2, sessionsCompleted: 36 },
  { id: 'user-liam', name: 'Liam Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', headline: 'Product Designer', xp: 4120, level: 5, streakDays: 12, rank: 3, sessionsCompleted: 29 },
  { id: 'user-kenji', name: 'Kenji Takahashi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', headline: 'Cybersecurity Analyst', xp: 3450, level: 4, streakDays: 9, rank: 4, sessionsCompleted: 22 },
  { id: 'user-current', name: 'Alex Chen (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', headline: 'Computer Science Student', xp: 2840, level: 4, streakDays: 7, rank: 5, sessionsCompleted: 18 },
];

export const INITIAL_REPORTS: ReportedItem[] = [
  {
    id: 'rep-1',
    targetId: 'post-spam-demo',
    targetType: 'forum_post',
    targetTitle: 'Promotion: Buy essay writing services here fast',
    reportedBy: 'Alex Chen',
    reason: 'Commercial spam violating peer learning ethics',
    createdAt: '1 hour ago',
    status: 'pending',
  },
  {
    id: 'rep-2',
    targetId: 'user-bad-demo',
    targetType: 'user',
    targetTitle: 'User: CryptoGuru99',
    reportedBy: 'Sofia Rodriguez',
    reason: 'Unsolicited DM trying to sell token signals instead of skill exchange',
    createdAt: '5 hours ago',
    status: 'pending',
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Emily Zhang',
    role: 'Computer Engineering Student at Stanford',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    quote: 'SkillSphere revolutionized how I study. I taught Python scripting to a biology major, and in return, she tutored me in Bioinformatics genetics. Zero money spent, 100% mutual empowerment!',
    rating: 5,
    tag: 'Python ⇄ Bioinformatics'
  },
  {
    id: 2,
    name: 'Marcus Brody',
    role: 'Aspiring Fullstack Developer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    quote: 'I used to struggle with CSS and design systems alone in front of YouTube tutorials. Through SkillSphere, I paired with Liam twice a week. Having a real peer review your work is 10x faster than any paid course.',
    rating: 5,
    tag: 'Figma ⇄ Tailwind CSS'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Data Science Researcher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    quote: 'The collaborative live room with video, code editor, and the built-in AI assistant makes pair programming effortless. It feels like Discord meets Duolingo for university peers.',
    rating: 5,
    tag: 'PyTorch ⇄ SQL'
  }
];

export const COMMUNITY_STATS = [
  { label: 'Active Peer Learners', value: '18,400+', icon: 'Users', change: '+24% this month' },
  { label: 'Knowledge Exchanges', value: '42,900+', icon: 'Repeat', change: '100% Cashless' },
  { label: 'Live Study Hours', value: '125,000+', icon: 'Clock', change: 'Collaborative Time' },
  { label: 'Satisfaction Rating', value: '4.94 / 5.0', icon: 'Star', change: 'Based on 8,200 reviews' }
];

export const FAQ_ITEMS = [
  {
    question: 'How does the cashless Skill Exchange work?',
    answer: 'SkillSphere operates on a mutual barter model. You list skills you are proficient in (e.g. JavaScript, Guitar, Spanish, Graphic Design) and skills you wish to learn. Our matching algorithm connects you with peers whose wants and offers match yours. You schedule live sessions and teach each other without any payment.'
  },
  {
    question: 'What if I am a complete beginner and don’t know what to teach?',
    answer: 'Everyone has unique skills! You can teach native language conversation, basic high school math, introductory tools (Notion, Excel, Canva), video editing, or study habits. You can also join as a "Learner" first and earn XP through quizzes and community participation.'
  },
  {
    question: 'What tools are available inside the Live Learning Room?',
    answer: 'The Live Room includes HD video/audio meeting controls, screen-sharing simulation, an interactive Collaborative Whiteboard with real-time drawing, a live shared Code Editor with syntax highlighting, a synchronized Pomodoro focus timer, and instant session chat.'
  },
  {
    question: 'How does the AI Learning Assistant (SphereAI) help?',
    answer: 'SphereAI acts as your 24/7 personal study copilot. It can explain complex concepts at any difficulty level, generate custom interactive 4-question quizzes to test your understanding, craft customized 4-week learning roadmaps, and recommend the best peer tutors on the platform.'
  },
  {
    question: 'Is SkillSphere safe and moderated?',
    answer: 'Yes! We have automated content filters, verified student badges, community review scores, and an active Administrator moderation dashboard where inappropriate behavior or spam can be reported and resolved immediately.'
  }
];
