import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserSkill } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole, teachSkill?: string, learnSkill?: string) => boolean;
  logout: () => void;
  switchDemoAccount: (role: 'learner' | 'tutor' | 'admin') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addTeachableSkill: (skill: Omit<UserSkill, 'id'>) => void;
  addLearnableSkill: (skill: Omit<UserSkill, 'id'>) => void;
  removeSkill: (skillId: string, type: 'teach' | 'learn') => void;
  toggleUserStatus: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('skillsphere_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('skillsphere_current_user_id') || 'user-current';
  });

  useEffect(() => {
    localStorage.setItem('skillsphere_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('skillsphere_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('skillsphere_current_user_id');
    }
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || null;

  const login = (email: string): boolean => {
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      if (matched.status === 'suspended') {
        alert('This account has been temporarily suspended by an administrator.');
        return false;
      }
      setCurrentUserId(matched.id);
      return true;
    }
    // If not found in mock, create or log in as default
    const existingDefault = users[0];
    if (existingDefault) {
      setCurrentUserId(existingDefault.id);
      return true;
    }
    return false;
  };

  const register = (
    name: string,
    email: string,
    role: UserRole,
    teachSkill?: string,
    learnSkill?: string
  ): boolean => {
    const newId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role,
      headline: `${role === 'tutor' ? 'Peer Tutor' : role === 'both' ? 'Learner & Tutor' : 'Passionate Student'} at SkillSphere`,
      bio: `Hello! I just joined SkillSphere to exchange skills, collaborate with fellow students, and level up together!`,
      location: 'Global Community',
      timezone: 'UTC+0',
      rating: 5.0,
      reviewsCount: 1,
      skillsToTeach: teachSkill
        ? [
            {
              id: `st-${Date.now()}`,
              name: teachSkill,
              category: 'General',
              level: 'Intermediate',
              yearsOfExperience: 1,
              endorsements: 1,
            },
          ]
        : [],
      skillsToLearn: learnSkill
        ? [
            {
              id: `sl-${Date.now()}`,
              name: learnSkill,
              category: 'General',
              level: 'Beginner',
            },
          ]
        : [],
      availability: {
        weekdays: true,
        weekends: true,
        mornings: false,
        evenings: true,
        hoursPerWeek: 5,
      },
      xp: 150,
      level: 1,
      streakDays: 1,
      badges: ['b1'],
      isVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newId);
    return true;
  };

  const logout = () => {
    setCurrentUserId('');
  };

  const switchDemoAccount = (role: 'learner' | 'tutor' | 'admin') => {
    if (role === 'admin') {
      const admin = users.find((u) => u.id === 'user-admin') || users.find((u) => u.role === 'admin');
      if (admin) setCurrentUserId(admin.id);
    } else if (role === 'tutor') {
      const tutor = users.find((u) => u.id === 'user-maya') || users.find((u) => u.role === 'tutor');
      if (tutor) setCurrentUserId(tutor.id);
    } else {
      const learner = users.find((u) => u.id === 'user-current') || users[0];
      if (learner) setCurrentUserId(learner.id);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const addTeachableSkill = (skill: Omit<UserSkill, 'id'>) => {
    if (!currentUser) return;
    const newSkill: UserSkill = {
      ...skill,
      id: `skill-t-${Date.now()}`,
      endorsements: 0,
    };
    updateProfile({
      skillsToTeach: [...currentUser.skillsToTeach, newSkill],
    });
  };

  const addLearnableSkill = (skill: Omit<UserSkill, 'id'>) => {
    if (!currentUser) return;
    const newSkill: UserSkill = {
      ...skill,
      id: `skill-l-${Date.now()}`,
    };
    updateProfile({
      skillsToLearn: [...currentUser.skillsToLearn, newSkill],
    });
  };

  const removeSkill = (skillId: string, type: 'teach' | 'learn') => {
    if (!currentUser) return;
    if (type === 'teach') {
      updateProfile({
        skillsToTeach: currentUser.skillsToTeach.filter((s) => s.id !== skillId),
      });
    } else {
      updateProfile({
        skillsToLearn: currentUser.skillsToLearn.filter((s) => s.id !== skillId),
      });
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchDemoAccount,
        updateProfile,
        addTeachableSkill,
        addLearnableSkill,
        removeSkill,
        toggleUserStatus,
        changeUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
