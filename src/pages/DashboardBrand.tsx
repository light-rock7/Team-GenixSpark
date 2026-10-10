import React from 'react';
import { BriefcaseBusiness, FilePlus2, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BriefCard } from '../components/briefs/BriefCard';
import { getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { useBrandBriefs } from '../hooks/useBrandBriefs';
import type { BriefStatus, CreativeBrief } from '../types/brief';

export const DashboardBrand: React.FC = () => {
  const { profile } = useAuth();
  const { briefs, stats, loading, error, refresh, setStatus, remove } = useBrandBriefs();

  const handleStatus = (brief: CreativeBrief, status: BriefStatus) => {
    void setStatus(brief.id, status).catch(() => undefined);
  };

  const handleDelete = (brief: CreativeBrief) => {
    void remove(brief.id).catch(() => undefined);
  };

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <section className="border-b border-slate-800 bg-[#0b1020] text-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-violet-200">
                <BriefcaseBusiness className="h-3.5 w-3.5" /> Brand workspace
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Define the work before searching for the talent.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Welcome, {profile?.display_name || 'brand partner'}. Turn creative goals into structured briefs that creators can understand and the marketplace can match against.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/brand/briefs/new" className={getButtonClassName({ variant: 'secondary', size: 'md' })}>
                  <FilePlus2 className="h-4 w-4" /> Create creative brief
                </Link>
                <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.08]">
                  <Search className="h-4 w-4" /> Discover creators
                </Link>
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Brief pipeline</p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div><p className="text-2xl font-semibold tracking-[-0.04em]">{stats.open}</p><p className="mt-1 text-[9px] text-slate-500">Open</p></div>
                <div><p className="text-2xl font-semibold tracking-[-0.04em]">{stats.drafts}</p><p className="mt-1 text-[9px] text-slate-500">Drafts</p></div>
                <div><p className="text-2xl font-semibold tracking-[-0.04em]">{stats.closed}</p><p className="mt-1 text-[9px] text-slate-500">Closed</p></div>
              </div>
              <div className="mt-5 border-t border-white/10 pt-4 text-[10px] leading-5 text-slate-400">
                Tools + skills + category become explicit matching signals for Stage 3 discovery.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600">Creative briefs</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">Your project definitions</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Publish when requirements are ready; keep early ideas private as drafts.</p>
          </div>
          <Link to="/brand/briefs/new" className={getButtonClassName({ variant: 'primary', size: 'sm' })}>
            <FilePlus2 className="h-4 w-4" /> New brief
          </Link>
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            <span>{error}</span>
            <button type="button" onClick={() => void refresh()} className="font-semibold underline">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="mt-6 surface-card rounded-[22px]"><LoadingState message="Loading brand briefs" description="Reading your structured project requirements." /></div>
        ) : briefs.length > 0 ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {briefs.map((brief) => <BriefCard key={brief.id} brief={brief} editable onStatusChange={handleStatus} onDelete={handleDelete} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Sparkles className="h-5 w-5" /></div>
            <h3 className="mt-4 text-base font-semibold text-slate-950">Start with a structured brief</h3>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-500">Define the outcome, deliverables, budget and required AI capabilities. GenixSpark can then carry those requirements into creator discovery.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/brand/briefs/new" className={getButtonClassName({ variant: 'primary', size: 'sm' })}><FilePlus2 className="h-4 w-4" /> Create first brief</Link>
              <Link to="/marketplace" className={getButtonClassName({ variant: 'outline', size: 'sm' })}><Search className="h-4 w-4" /> Browse creators</Link>
            </div>
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['01', 'Outcome first', 'Describe the commercial problem and deliverables before prescribing a model.'],
            ['02', 'Capability signals', 'Use AI tools and skills only when they materially affect successful delivery.'],
            ['03', 'Commercial clarity', 'Budget, deadline and usage rights help creators self-qualify before applying.'],
          ].map(([number, title, copy]) => (
            <div key={number} className="surface-card rounded-[18px] p-5">
              <p className="text-[10px] font-bold text-violet-600">{number}</p>
              <p className="mt-3 text-xs font-semibold text-slate-950">{title}</p>
              <p className="mt-1.5 text-[10px] leading-5 text-slate-500">{copy}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
