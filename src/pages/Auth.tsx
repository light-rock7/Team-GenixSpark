import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

export const Auth: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Derive mode directly from query parameters without redundant effect
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  // If already authenticated and profile is loaded or available, redirect to dashboard
  useEffect(() => {
    if (!loading && user && profile) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, loading, navigate]);

  const handleToggle = () => {
    const nextMode = mode === 'login' ? 'signup' : 'login';
    setSearchParams({ mode: nextMode });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-violet-700 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6 text-violet-300" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back' : 'Join GenixSpark Marketplace'}
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto">
          {mode === 'login'
            ? 'Sign in to manage your AI creator assets or brand creative briefs.'
            : 'Select your account role and join the AI creative network.'}
        </p>

        {/* Mode switcher tabs */}
        <div className="mt-6 p-1 bg-slate-200/80 rounded-xl flex max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setSearchParams({ mode: 'login' })}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ mode: 'signup' })}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200 sm:px-10">
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggle} />
          ) : (
            <SignupForm onToggleMode={handleToggle} />
          )}
        </div>
      </div>
    </div>
  );
};
