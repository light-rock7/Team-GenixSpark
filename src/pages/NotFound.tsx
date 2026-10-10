import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Compass, Home as HomeIcon, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { getButtonClassName } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8" />
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">
          Error 404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          The requested URL <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs text-violet-700">{location.pathname}</code> does not exist on this application.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-2">Available Application Routes:</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li><code className="text-violet-600 font-mono">/</code> — Marketplace Landing Page</li>
            <li><code className="text-violet-600 font-mono">/auth</code> — Sign In &amp; Registration Portal</li>
            <li><code className="text-violet-600 font-mono">/dashboard</code> — Role-Protected Dashboard Entry</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className={getButtonClassName({ variant: 'primary', size: 'md' })}
          >
            <HomeIcon className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className={getButtonClassName({ variant: 'outline', size: 'md' })}
          >
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            Open Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer py-2 px-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
