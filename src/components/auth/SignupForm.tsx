import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SignupFormProps {
  onToggleMode?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const { signup, isConfigured } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<{ email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      setErrorMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file.');
      return;
    }

    if (!displayName.trim()) {
      setErrorMessage('Please enter your full name or creator handle.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { data, error, requiresEmailConfirmation } = await signup(
      email.trim(),
      password,
      displayName.trim(),
      role
    );
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // Handle email confirmation requirement:
    // Do not navigate to a logged-in dashboard if signup requires confirmation and no session exists.
    if (requiresEmailConfirmation) {
      setConfirmationNotice({ email: email.trim() });
      return;
    }

    // If an active session was immediately granted (e.g., auto-confirm is enabled in Supabase)
    if (data?.session) {
      navigate('/dashboard');
    }
  };

  if (confirmationNotice) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Check Your Inbox</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          We&apos;ve sent a verification link to{' '}
          <span className="font-semibold text-slate-800">{confirmationNotice.email}</span>.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Please confirm your email address before logging in to access your dashboard.
        </p>
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onToggleMode}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Supabase Environment Unconfigured</p>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              Authentication is disabled because backend Supabase environment variables are missing.
              Copy <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.example</code> to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> and populate credentials.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('creator')}
              disabled={isSubmitting || !isConfigured}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'creator'
                  ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className={`w-4 h-4 ${role === 'creator' ? 'text-violet-600' : 'text-slate-500'}`} />
                <span className={`text-sm font-bold ${role === 'creator' ? 'text-violet-950' : 'text-slate-800'}`}>
                  AI Creator
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Publish AI assets, showcase prompts, and monetize projects.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('brand')}
              disabled={isSubmitting || !isConfigured}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'brand'
                  ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className={`w-4 h-4 ${role === 'brand' ? 'text-violet-600' : 'text-slate-500'}`} />
                <span className={`text-sm font-bold ${role === 'brand' ? 'text-violet-950' : 'text-slate-800'}`}>
                  Brand / Agency
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Post creative briefs, hire vetted talent, manage workflows.
              </p>
            </button>
          </div>
        </div>

        <Input
          label="Display Name or Brand Name"
          type="text"
          placeholder="e.g. Alex Vance or Nova Labs"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
          disabled={isSubmitting || !isConfigured}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
          disabled={isSubmitting || !isConfigured}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
          disabled={isSubmitting || !isConfigured}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
          disabled={isSubmitting || !isConfigured}
        />

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={!isConfigured}
            size="md"
          >
            Create {role === 'creator' ? 'Creator' : 'Brand'} Account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-violet-600 hover:text-violet-700 underline underline-offset-2 ml-1 cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
