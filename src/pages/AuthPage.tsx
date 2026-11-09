import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, switchDemoAccount } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('both');
  const [teachSkill, setTeachSkill] = useState('');
  const [learnSkill, setLearnSkill] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const ok = login(email);
      if (ok) {
        navigate('/dashboard');
      } else {
        setErrorMessage('User not found. Please register or select a Quick Demo Account below.');
      }
    } else {
      if (!name || !email) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      register(name, email, role, teachSkill, learnSkill);
      navigate('/dashboard');
    }
  };

  const handleDemoSelect = (persona: 'learner' | 'tutor' | 'admin') => {
    switchDemoAccount(persona);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mx-auto shadow-lg shadow-[#5865F2]/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome back to SkillSphere' : 'Join SkillSphere Community'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Enter your credentials or choose a quick demo account.'
              : 'Start learning and teaching with curious peers worldwide.'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-colors ${
                mode === 'login' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-colors ${
                mode === 'register' ? 'bg-[#5865F2] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    I want to join as:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'learner', label: 'Learner' },
                      { id: 'tutor', label: 'Peer Tutor' },
                      { id: 'both', label: 'Both' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as any)}
                        className={`py-2 rounded-xl border text-center font-bold transition-colors ${
                          role === r.id
                            ? 'border-[#5865F2] bg-[#5865F2]/10 text-[#5865F2]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Skill to Teach
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python"
                      value={teachSkill}
                      onChange={(e) => setTeachSkill(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Skill to Learn
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React"
                      value={learnSkill}
                      onChange={(e) => setLearnSkill(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="alex.chen@student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] text-[#5865F2] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#22D3EE] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'login' ? 'Sign In to SkillSphere' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instant 1-Click Evaluation Accounts
            </span>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoSelect('learner')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#5865F2] bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-center font-bold"
              >
                🎓 Alex Chen
                <span className="block text-[9px] text-slate-400 font-normal">Learner</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('tutor')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#8B5CF6] bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-center font-bold"
              >
                🔬 Dr. Maya
                <span className="block text-[9px] text-slate-400 font-normal">Senior Tutor</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('admin')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-center font-bold"
              >
                🛡️ Admin
                <span className="block text-[9px] text-slate-400 font-normal">Moderator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Password</h3>
            <p className="text-xs text-slate-500">
              Enter your student email and we will simulate sending a password reset token.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 text-xs font-semibold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p>Password reset instructions have been sent to your inbox!</p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="mt-2 text-[#5865F2] underline font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="student@university.edu"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setResetSent(true)}
                    className="px-4 py-1.5 rounded-xl bg-[#5865F2] text-white font-bold text-xs"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

