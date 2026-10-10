import React, { useMemo, useState } from 'react';
import { AlertCircle, Eye, Images, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      setActionError(err instanceof Error ? err.message : 'Unable to update portfolio visibility.');
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
        <LoadingState message="Loading AI portfolio" description="Preparing your published work and drafts." />
      </>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />

      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Portfolio evidence</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-slate-950">Show work that explains how you deliver.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Treat every project like a concise case study: strong visual proof, relevant tools, and just enough workflow context to build confidence.</p>
          </div>
          <Link to="/creator/portfolio/new" className={getButtonClassName({ variant: 'primary', size: 'md' })}>
            <Plus className="h-4 w-4" /> Add case study
          </Link>
        </div>

        {(error || actionError) && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionError || error}</span>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{stats.total}</p><p className="mt-0.5 text-[10px] text-slate-400">Total</p></div>
            <div className="h-8 w-px bg-slate-200" />
            <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{stats.published}</p><p className="mt-0.5 text-[10px] text-slate-400">Published</p></div>
            <div className="h-8 w-px bg-slate-200" />
            <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{stats.drafts}</p><p className="mt-0.5 text-[10px] text-slate-400">Drafts</p></div>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {(['all', 'published', 'drafts'] as PortfolioFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-2 text-[11px] font-bold capitalize transition-all ${filter === value ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {visibleItems.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <PortfolioCard key={item.id} item={item} editable onTogglePublished={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              {filter === 'published' ? <Eye className="h-5 w-5" /> : <Images className="h-5 w-5" />}
            </div>
            <h2 className="mt-4 text-base font-extrabold tracking-[-0.02em] text-slate-950">
              {filter === 'all' ? 'No portfolio case studies yet' : `No ${filter} work yet`}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-500">
              {filter === 'all'
                ? 'Start with one strong project that demonstrates your visual quality, AI toolchain, and production reasoning.'
                : 'Change the filter or add a new case study when you are ready.'}
            </p>
            {filter === 'all' && (
              <Link to="/creator/portfolio/new" className={`${getButtonClassName({ variant: 'primary', size: 'md' })} mt-5`}>
                <Plus className="h-4 w-4" /> Create first case study
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};