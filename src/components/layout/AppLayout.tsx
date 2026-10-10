import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />

      <main className="min-h-[calc(100vh-68px)]">
        {children || <Outlet />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="page-shell py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-violet-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold tracking-[-0.02em] text-slate-900">GenixSpark</p>
                <p className="mt-0.5 text-[10px] text-slate-400">AI-native creator discovery and workflow proof.</p>
              </div>
            </div>
            <p className="text-[10px] font-medium tracking-[0.04em] text-slate-400">
              Creator portfolios · Creative briefs · Explainable matching
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};