import React, { useState } from 'react';
import { Briefcase, FilePlus, Users, FileCheck2, AlertCircle, Plus, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const DashboardBrand: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'briefs' | 'proposals' | 'contracts'>('briefs');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Welcome & Identity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
                <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                Brand / Agency Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {profile?.display_name || 'Brand Partner'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Logged in as <span className="font-medium text-slate-700">{user?.email}</span>. Publish creative briefs, review creator proposals, and manage commissioned assets.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs for Brand modules */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('briefs')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'briefs'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>Creative Briefs</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('proposals')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'proposals'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Creator Proposals</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contracts')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'contracts'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Active Deliverables</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal">
              0
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Panels with Genuine Empty States */}
      {activeTab === 'briefs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4 border border-violet-100">
            <FilePlus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Creative Briefs Posted Yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Create structured creative briefs specifying style models, aspect ratios, target deliverables, and budgets to receive proposals from generative artists.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              disabled
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Post Creative Brief (Coming Soon)
            </Button>
            <Button
              variant="outline"
              size="md"
              disabled
              leftIcon={<Search className="w-4 h-4" />}
            >
              Discover Creators (Coming Soon)
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Creator Proposals Received
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Once you post a creative brief, creator proposals and sample generation prompts will appear here for review.
          </p>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Active Deliverables
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Commissioned creators, milestone deliverables, and asset approvals will be tracked here.
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
