import React, { useState } from 'react';
import { Sparkles, Palette, FileText, Send, AlertCircle, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const DashboardCreator: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'portfolios' | 'applications' | 'deliveries'>('portfolios');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Welcome & Identity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200">
                <Sparkles className="w-3.5 h-3.5" />
                AI Creator Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {profile?.display_name || 'Creator'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Logged in as <span className="font-medium text-slate-700">{user?.email}</span>. Organize your AI style showcases, pitch on brand briefs, and manage deliverables.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs for Creator modules */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('portfolios')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'portfolios'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>AI Portfolios &amp; Assets</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'applications'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Brief Applications</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deliveries')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'deliveries'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Active Deliveries</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Panels with Genuine Empty States */}
      {activeTab === 'portfolios' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4 border border-violet-100">
            <Palette className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No AI Portfolios Published Yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Showcase your model fine-tunes, prompt frameworks, and generative style samples to apply for creative briefs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              disabled
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Portfolio (Coming Soon)
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Active Brief Applications
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Browse creative briefs published by brands and submit proposals with your style samples.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              disabled
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              Explore Creative Briefs (Coming Soon)
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Deliveries in Progress
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Active milestone deliveries, generation logs, and review status will appear here once brief proposals are accepted.
          </p>
        </div>
      )}

      {/* Account Verification & Technical Diagnostics (Dev Environment Only) */}
      {import.meta.env.DEV && (
        <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white">
          <h4 className="text-xs font-mono font-bold flex items-center gap-2 text-violet-300">
            <AlertCircle className="w-3.5 h-3.5" />
            [DEV ONLY] Profile Session Diagnostics
          </h4>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block mb-1">User ID:</span>
              <span className="font-mono text-slate-200 break-all">{user?.id}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block mb-1">Role:</span>
              <span className="font-semibold text-violet-300 uppercase">{profile?.role}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <span className="text-slate-400 block mb-1">Profile Table:</span>
              <span className="font-mono text-emerald-400">public.user_profiles</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
