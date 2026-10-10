import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-violet-200 selection:text-violet-900">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <span className="text-xs font-semibold text-slate-900">
                GenixSpark AI Creator Marketplace
              </span>
              <span className="text-[10px] text-slate-400">
                • Stage 1 Foundation
              </span>
            </div>

            <div className="text-xs text-slate-500 text-center sm:text-right">
              Built with React 19, TypeScript, Vite, Tailwind CSS, &amp; Supabase
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
