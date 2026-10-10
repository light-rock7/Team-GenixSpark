import React, { useState } from 'react';
import { RefreshCw, Search, SlidersHorizontal, Sparkles, Users } from 'lucide-react';
import { CreatorDiscoveryCard } from '../components/discovery/CreatorDiscoveryCard';
import { DiscoveryFiltersPanel } from '../components/discovery/DiscoveryFiltersPanel';
import { LoadingState } from '../components/ui/LoadingState';
import { useCreatorDiscovery } from '../hooks/useCreatorDiscovery';
import type { DiscoverySort } from '../types/discovery';

export const Marketplace: React.FC = () => {
  const {
    creators,
    results,
    filters,
    setFilters,
    sort,
    setSort,
    options,
    activeFilterCount,
    loading,
    error,
    refresh,
    resetFilters,
  } = useCreatorDiscovery();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <section className="border-b border-slate-800 bg-[#0b1020] text-white">
        <div className="page-shell py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-violet-200">
                <Sparkles className="h-3.5 w-3.5" /> Capability-led discovery
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Find creators by the work they can actually deliver.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Search AI creators by toolchain, creative skill, specialization, availability and experience. Match percentages are deterministic and based only on the criteria you select.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.04em]">{creators.length}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-slate-500">Creator profiles</p>
                </div>
                <Users className="h-6 w-6 text-violet-300" />
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-slate-400">
                Profiles are ranked by selected criteria when filters are active, otherwise by marketplace readiness signals.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.query}
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              placeholder="Search creator, tool, skill, location or specialization..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />
          </label>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((value) => !value)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] text-white">{activeFilterCount}</span>}
          </button>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as DiscoverySort)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
          >
            <option value="best_fit">Best fit</option>
            <option value="experience">Most experienced</option>
            <option value="newest">Newest profiles</option>
          </select>
        </div>

        {mobileFiltersOpen && (
          <div className="mt-4 lg:hidden">
            <DiscoveryFiltersPanel filters={filters} options={options} activeCount={activeFilterCount} onChange={setFilters} onReset={resetFilters} />
          </div>
        )}

        <div className="mt-7 grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <DiscoveryFiltersPanel filters={filters} options={options} activeCount={activeFilterCount} onChange={setFilters} onReset={resetFilters} />
            </div>
          </aside>

          <main>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{loading ? 'Finding creators…' : `${results.length} creator${results.length === 1 ? '' : 's'} found`}</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {activeFilterCount > 0 ? 'Fit scores explain how selected criteria overlap with each creator profile.' : 'Add filters to compare creators against explicit requirements.'}
                </p>
              </div>
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="text-[11px] font-semibold text-violet-700 hover:text-violet-800">Clear all criteria</button>
              )}
            </div>

            {loading ? (
              <div className="mt-6 rounded-[22px] border border-slate-200 bg-white">
                <LoadingState message="Loading creator marketplace" description="Reading creator profiles, toolchains and portfolio signals." />
              </div>
            ) : error ? (
              <div className="mt-6 rounded-[22px] border border-rose-200 bg-rose-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-rose-800">Unable to load creator discovery</p>
                <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-rose-600">{error}</p>
                <button type="button" onClick={() => void refresh()} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-700 shadow-sm">
                  <RefreshCw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Search className="h-5 w-5" /></div>
                <h2 className="mt-4 text-base font-semibold text-slate-950">No creators match every active filter</h2>
                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">Try broadening one tool, skill, availability or experience requirement.</p>
                <button type="button" onClick={resetFilters} className="mt-4 text-xs font-semibold text-violet-700 hover:text-violet-800">Reset filters</button>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {results.map((result) => <CreatorDiscoveryCard key={result.creator.user_id} result={result} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
