import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

export const Auth: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  useEffect(() => {
    if (!loading && user && profile) navigate('/dashboard', { replace: true });
  }, [user, profile, loading, navigate]);

  const handleToggle = () => setSearchParams({ mode: mode === 'login' ? 'signup' : 'login' });

  return (
    <div className="min-h-screen bg-[#f7f8fb] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#0b1020] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_5%,rgba(109,74,255,.45),transparent_30rem),radial-gradient(circle_at_90%_80%,rgba(79,70,229,.20),transparent_26rem)]" />
        <div className="soft-grid absolute inset-0 opacity-50" />

        <Link to="/" className="relative z-10 inline-flex items-center gap-3 self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-violet-200 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-[-0.03em]">GenixSpark</p>
            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">AI creator marketplace</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-xl py-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">Professional creative infrastructure</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-[-0.055em] xl:text-6xl">
            Build trust around the creative process, not just the final image.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">
            GenixSpark gives creators a workflow-aware portfolio and gives brands a better way to evaluate AI production capability.
          </p>

          <div className="mt-9 space-y-3">
            {[
              'Creator profiles built around real AI tools and specializations',
              'Portfolio case studies with workflow and prompt context',
              'Structured briefs that make creative requirements explicit',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
          <div><p className="text-lg font-extrabold">AI-native</p><p className="mt-1 text-[10px] text-slate-500">tool-aware profiles</p></div>
          <div><p className="text-lg font-extrabold">Evidence</p><p className="mt-1 text-[10px] text-slate-500">workflow transparency</p></div>
          <div><p className="text-lg font-extrabold">Focused</p><p className="mt-1 text-[10px] text-slate-500">creator-brand matching</p></div>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-[470px]">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950 lg:hidden">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>

          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
              {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-slate-950">
              {mode === 'login' ? 'Sign in to GenixSpark' : 'Join the AI creative network'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === 'login'
                ? 'Access your creator portfolio or brand workspace.'
                : 'Choose the role that matches how you want to use the marketplace.'}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setSearchParams({ mode: 'login' })}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-all ${mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setSearchParams({ mode: 'signup' })}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-all ${mode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Create account
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,.07)] sm:p-7">
            {mode === 'login' ? <LoginForm onToggleMode={handleToggle} /> : <SignupForm onToggleMode={handleToggle} />}
          </div>

          <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
            By continuing, you’re entering a workspace designed for professional AI creative collaboration.
          </p>
        </div>
      </main>
    </div>
  );
};