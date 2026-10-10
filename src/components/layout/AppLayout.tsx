import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-violet-200 selection:text-violet-950">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900">GenixSpark</span>
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600">AI Creator Marketplace</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center sm:text-right">
              Workflow-aware creator profiles · AI portfolios · creative brief matching
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
