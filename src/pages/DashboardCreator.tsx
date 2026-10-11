import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Images,
  MapPin,
  Plus,
  Sparkles,
  TrendingUp,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { PortfolioCard } from '../components/creator/PortfolioCard';
import { getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { useCreatorPortfolio } from '../hooks/useCreatorPortfolio';
import { useCreatorProfile } from '../hooks/useCreatorProfile';

export const DashboardCreator: React.FC = () => {
  const { user } = useAuth();
  const { profile, completion, loading: profileLoading } = useCreatorProfile();
  const { items, stats, loading: portfolioLoading } = useCreatorPortfolio();

  if (profileLoading || portfolioLoading) {
    return (
      <>
        <CreatorWorkspaceNav />
        <LoadingState message="Opening creator studio" description="Loading your profile and portfolio signals." />
      </>
    );
  }

  const firstName = (profile?.display_name || user?.email?.split('@')[0] || 'Creator').split(' ')[0];
  const recentWork = items.slice(0, 3);
  const statusLabel = profile?.availability === 'busy'
    ? 'Limited availability'
    : profile?.availability === 'unavailable'
      ? 'Not taking briefs'
      : 'Available for briefs';

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />

      <div className="page-shell py-8 sm:py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 shadow-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${profile?.availability === 'available' ? 'bg-emerald-500' : profile?.availability === 'busy' ? 'bg-amber-500' : 'bg-slate-400'}`} />
              {statusLabel}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep your creator signal sharp: a strong profile, relevant portfolio proof, and enough workflow detail for brands to evaluate you quickly.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/creator/portfolio/new" className={getButtonClassName({ variant: 'primary', size: 'md' })}>
              <Plus className="h-4 w-4" /> Add case study
            </Link>
            <Link to={`/creators/${user?.id}`} className={getButtonClassName({ variant: 'outline', size: 'md' })}>
              <Eye className="h-4 w-4" /> Preview public profile
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,.05)]">
            <div className="grid gap-0 md:grid-cols-[1fr_250px]">
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-100 to-slate-100 text-xl font-extrabold text-violet-600">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-6 w-6" />
                    )}
                  </div>
                  <div className="min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-extrabold tracking-[-0.035em] text-slate-950">{profile?.display_name || 'Complete your creator profile'}</h2>
                      {completion.percent >= 80 && <BadgeCheck className="h-4.5 w-4.5 text-violet-600" />}
                    </div>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                      {profile?.headline || 'Add a clear professional headline that explains your AI creative specialization.'}
                    </p>
                    {profile?.location && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"><MapPin className="h-3.5 w-3.5" /> {profile.location}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile?.ai_tools.slice(0, 5).map((tool) => (
                    <span key={tool} className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-[10px] font-semibold text-violet-700">
                      <WandSparkles className="h-3 w-3" /> {tool}
                    </span>
                  ))}
                  {profile?.ai_tools.length === 0 && (
                    <Link to="/creator/profile" className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-[10px] font-semibold text-slate-500 hover:border-violet-300 hover:text-violet-700">
                      Add AI tools <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <div className="mt-7 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Profile readiness</p>
                      <p className="mt-1 text-[11px] text-slate-400">{completion.completed} of {completion.total} marketplace signals completed</p>
                    </div>
                    <span className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">{completion.percent}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#6d4aff] transition-all duration-500" style={{ width: `${completion.percent}%` }} />
                  </div>
                  {completion.percent < 100 && (
                    <Link to="/creator/profile" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800">
                      Improve profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/70 p-6 md:border-l md:border-t-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Signal snapshot</p>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">{stats.total}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Portfolio case studies</p>
                  </div>
                  <div className="border-t border-slate-200 pt-5">
                    <p className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">{profile?.ai_tools.length || 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">AI tools listed</p>
                  </div>
                  <div className="border-t border-slate-200 pt-5">
                    <p className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">{profile?.specializations.length || 0}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Specializations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[26px] bg-[#0b1020] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.12)] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">Marketplace readiness</span>
              <Sparkles className="h-4 w-4 text-violet-300" />
            </div>
            <h3 className="mt-5 text-xl font-extrabold tracking-[-0.035em]">Make the next review effortless.</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">Human evaluators and brands should understand your value in seconds.</p>

            <div className="mt-6 space-y-3">
              {completion.missing.length > 0 ? completion.missing.slice(0, 3).map((missing) => (
                <Link key={missing} to="/creator/profile" className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[.045] px-3.5 py-3 text-xs text-slate-300 hover:bg-white/[.075]">
                  <span>Add {missing.toLowerCase()}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300" />
                </Link>
              )) : (
                <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/[.06] p-4">
                  <p className="flex items-center gap-2 text-xs font-bold text-emerald-200"><BadgeCheck className="h-4 w-4" /> Profile discovery-ready</p>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">Keep your availability and newest portfolio evidence current.</p>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Portfolio evidence</p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">Recent work</h2>
            </div>
            <Link to="/creator/portfolio" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-700">
              Manage portfolio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentWork.length > 0 ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recentWork.map((item) => <PortfolioCard key={item.id} item={item} compact />)}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Images className="h-5 w-5" /></div>
              <h3 className="mt-4 text-base font-extrabold tracking-[-0.02em] text-slate-950">Turn your strongest work into proof.</h3>
              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-500">Add a case study with the visual, AI tools, workflow summary, and rights context that help a brand understand how you deliver.</p>
              <Link to="/creator/portfolio/new" className={`${getButtonClassName({ variant: 'primary', size: 'md' })} mt-5`}>
                <Plus className="h-4 w-4" /> Add first case study
              </Link>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><Images className="h-4 w-4 text-violet-600" /> Published work</div>
            <p className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">{stats.published}</p>
            <p className="mt-1 text-[11px] text-slate-400">Visible on your public profile</p>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><WandSparkles className="h-4 w-4 text-violet-600" /> Tool coverage</div>
            <p className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">{profile?.ai_tools.length || 0}</p>
            <p className="mt-1 text-[11px] text-slate-400">Capabilities available for matching</p>
          </div>
          <div className="surface-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><TrendingUp className="h-4 w-4 text-emerald-500" /> Working status</div>
            <p className="mt-3 text-sm font-extrabold capitalize tracking-[-0.02em]">{profile?.availability || 'available'}</p>
            <p className="mt-1 text-[11px] text-slate-400">Current marketplace availability</p>
          </div>
        </section>
      </div>
    </div>
  );
};