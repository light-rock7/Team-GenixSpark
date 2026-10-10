import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Compass, Home as HomeIcon, LayoutDashboard, Search } from 'lucide-react';
import { getButtonClassName } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[24px] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_55px_rgba(15,23,42,.08)] sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Compass className="h-7 w-7" />
        </div>

        <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">404 · Route not found</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">This workspace path does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We could not resolve <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-violet-700">{location.pathname}</code>. Choose a known marketplace destination below.
        </p>

        <div className="mt-6 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-600 sm:grid-cols-2">
          <Link to="/marketplace" className="rounded-xl bg-white px-3 py-3 font-semibold text-slate-700 shadow-sm hover:text-violet-700">
            <span className="flex items-center gap-2"><Search className="h-3.5 w-3.5" /> Discover creators</span>
          </Link>
          <Link to="/dashboard" className="rounded-xl bg-white px-3 py-3 font-semibold text-slate-700 shadow-sm hover:text-violet-700">
            <span className="flex items-center gap-2"><LayoutDashboard className="h-3.5 w-3.5" /> Open workspace</span>
          </Link>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link to="/" className={getButtonClassName({ variant: 'primary', size: 'md' })}>
            <HomeIcon className="h-4 w-4" /> Back to home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Go back
          </button>
        </div>
      </div>
    </div>
  );
};
