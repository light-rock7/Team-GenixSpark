import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onToggleMode?: () => void;
}

interface AuthReturnState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      setErrorMessage(
        import.meta.env.DEV
          ? 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file.'
          : 'Authentication service is currently unavailable. Please try again later.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await login(email.trim(), password);

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please verify your credentials and try again.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      const from = (location.state as AuthReturnState | null)?.from;
      const returnTo = from?.pathname
        ? `${from.pathname}${from.search || ''}${from.hash || ''}`
        : '/dashboard';

      navigate(returnTo, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication Unavailable</p>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              Authentication services are currently disabled.
            </p>
            {import.meta.env.DEV && (
              <p className="mt-2 text-[11px] text-amber-700 bg-amber-100/70 p-2 rounded font-mono leading-normal">
                [DEV] Copy <code>.env.example</code> to <code>.env.local</code> and set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
              </p>
            )}
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
        <Input
          label="Email Address"
          type="email"
          placeholder="creator@example.com"
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
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
            Sign In to Account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{' '}
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-violet-600 hover:text-violet-700 underline underline-offset-2 ml-1 cursor-pointer"
        >
          Create one now
        </button>
      </div>
    </div>
  );
};
