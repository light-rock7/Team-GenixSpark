import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  FilePenLine,
  Images,
  Plus,
  Sparkles,
} from 'lucide-react';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { PortfolioCard } from '../components/creator/PortfolioCard';
import { getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useCreatorPortfolio } from '../hooks/useCreatorPortfolio';
import type { PortfolioItem } from '../types/creator';

type PortfolioFilter = 'all' | 'published' | 'drafts';

export const CreatorPortfolio: React.FC = () => {
  const { items, stats, loading, error, togglePublished, remove } = useCreatorPortfolio();
  const [filter, setFilter] = useState<PortfolioFilter>('all');
  const [actionError, setActionError] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    if (filter === 'published') return items.filter((item) => item.is_published);
    if (filter === 'drafts') return items.filter((item) => !item.is_published);
    return items;
  }, [items, filter]);

  const handleToggle = async (item: PortfolioItem) => {
    setActionError(null);
    try {
      await togglePublished(item.id, !item.is_published);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Unable to update portfolio item.');
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    setActionError(null);
    try {
      await remove(item.id);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete portfolio item.');
    }
  };

  if (loading) {
    return (
      <>
        <CreatorWorkspaceNav />
        <LoadingState message="Loading AI portfolio" description="Collecting your published work and private drafts." />
      </>
    );
  }

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.08),_transparent_32%),linear-gradient(to_bottom,#f8fafc,#f8fafc)]">
      <CreatorWorkspaceNav />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
              <Images className="h-3.5 w-3.5" />
              AI portfolio
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-[-0.035em] text-slate-950">
              Show the work. Explain the workflow.
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
              Pair polished outcomes with AI tools, prompts, and process notes so brands can evaluate both taste and technical fit.
            </p>
          </div>

          <Link
            to="/creator/portfolio/new"
            className={getButtonClassName({
              variant: 'primary',
              size: 'lg',
              className: 'rounded-xl shadow-lg shadow-violet-200',
            })}
          >
            <Plus className="h-4.5 w-4.5" />
            Add portfolio work
          </Link>
        </div>

        {(error || actionError) && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-800">
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
            <span>{actionError || error}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Total work</span>
              <Images className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{stats.total}</p>
            <p className="mt-1 text-xs text-slate-500">Projects in your creator portfolio</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Published</span>
              <Eye className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{stats.published}</p>
            <p className="mt-1 text-xs text-slate-500">Visible to brands and marketplace visitors</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Drafts</span>
              <FilePenLine className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{stats.drafts}</p>
            <p className="mt-1 text-xs text-slate-500">Private work you can publish when ready</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 sm:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">Your first case study is the most important one.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                  Upload a strong image or video, name the AI tools used, and document enough of your prompt/workflow for a brand to understand how you create repeatable commercial results.
                </p>
                <Link
                  to="/creator/portfolio/new"
                  className={`${getButtonClassName({ variant: 'primary', size: 'lg' })} mt-6 rounded-xl`}
                >
                  Create first portfolio item
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="min-h-[280px] bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,.5),transparent_25%),radial-gradient(circle_at_75%_75%,rgba(59,130,246,.45),transparent_30%),linear-gradient(140deg,#0f172a,#1e1b4b_55%,#0f172a)] p-8 flex items-end">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">A strong GenixSpark portfolio item includes</p>
                  <div className="mt-3 space-y-2 text-sm text-white/85">
                    <p>01 · Finished creative output</p>
                    <p>02 · AI tool + skill metadata</p>
                    <p>03 · Prompt/process summary</p>
                    <p>04 · Workflow + commercial rights notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit">
                {([
                  ['all', `All ${stats.total}`],
                  ['published', `Published ${stats.published}`],
                  ['drafts', `Drafts ${stats.drafts}`],
                ] as [PortfolioFilter, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      filter === value
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Publish only the work you want brands to discover publicly.
              </p>
            </div>

            {visibleItems.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleItems.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    editable
                    onTogglePublished={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
                <p className="text-sm font-bold text-slate-800">No items in this view.</p>
                <p className="mt-1 text-xs text-slate-500">Switch filters or add new portfolio work.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
