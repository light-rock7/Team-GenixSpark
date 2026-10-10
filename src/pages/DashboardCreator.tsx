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
        <LoadingState message="Opening Creator Studio" description="Loading your profile, portfolio, and marketplace readiness." />
      </>
    );
  }

  const firstName = (profile?.display_name || user?.email?.split('@')[0] || 'Creator').split(' ')[0];
  const recentWork = items.slice(0, 3);

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.09),_transparent_32%),linear-gradient(to_bottom,#f8fafc,#f8fafc)]">
      <CreatorWorkspaceNav />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-2xl shadow-slate-200/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(124,58,237,.52),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(59,130,246,.25),transparent_32%),linear-gradient(135deg,#020617,#111827_55%,#1e1b4b)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.17em] text-violet-100 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Creator Studio
                </div>
                <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em]">
                  Build trust before the first brief, {firstName}.
                </h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                  Your GenixSpark presence combines creative taste with transparent AI workflow metadata so brands can discover the right creator with confidence.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile?.ai_tools.slice(0, 5).map((tool) => (
                    <span key={tool} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur">
                      <WandSparkles className="h-3.5 w-3.5 text-violet-300" /> {tool}
                    </span>
                  ))}
                  {profile?.ai_tools.length === 0 && (
                    <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">Add your AI tools to improve discovery</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 min-w-[210px]">
                <Link
                  to="/creator/portfolio/new"
                  className={`${getButtonClassName({ variant: 'primary', size: 'md', fullWidth: true })} rounded-xl`}
                >
                  <Plus className="h-4 w-4" /> Add portfolio work
                </Link>
                <Link
                  to={`/creators/${user?.id}`}
                  className={`${getButtonClassName({ variant: 'secondary-dark', size: 'md', fullWidth: true })} rounded-xl border-white/10`}
                >
                  <Eye className="h-4 w-4" /> View public profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Profile strength</span>
              <BadgeCheck className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{completion.percent}%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500" style={{ width: `${completion.percent}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Portfolio</span>
              <Images className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{stats.total}</p>
            <p className="mt-1 text-xs text-slate-500">{stats.published} published · {stats.drafts} drafts</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">AI tool depth</span>
              <WandSparkles className="h-4 w-4 text-fuchsia-500" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{profile?.ai_tools.length || 0}</p>
            <p className="mt-1 text-xs text-slate-500">Tools listed for matching</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Availability</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-lg font-black tracking-tight capitalize text-slate-950">{profile?.availability || 'Available'}</p>
            <p className="mt-1 text-xs text-slate-500">Marketplace working status</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-7">
          <main className="space-y-7">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">Marketplace readiness</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Finish the signals brands search for</h2>
                </div>
                <Link to="/creator/profile" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800">
                  Edit profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {completion.percent >= 90 ? (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Your creator profile is discovery-ready.</p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-700">Keep your AI tools, availability, and strongest portfolio work current as you take on new capabilities.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {completion.missing.slice(0, 4).map((missing, index) => (
                    <Link
                      key={missing}
                      to="/creator/profile"
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-violet-200 hover:bg-violet-50 transition-colors"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-700 ring-1 ring-slate-200 group-hover:ring-violet-200">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Add {missing.toLowerCase()}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">Improves profile quality and filtering.</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">Recent portfolio</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Latest creative proof</h2>
                </div>
                <Link to="/creator/portfolio" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800">
                  Manage all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {recentWork.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {recentWork.map((item) => <PortfolioCard key={item.id} item={item} compact />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <Images className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">No portfolio work yet</h3>
                  <p className="mt-1 mx-auto max-w-md text-xs leading-relaxed text-slate-500">Your strongest AI case studies are what turn a profile into a credible marketplace portfolio.</p>
                  <Link to="/creator/portfolio/new" className={`${getButtonClassName({ variant: 'primary', size: 'md' })} mt-5 rounded-xl`}>
                    <Plus className="h-4 w-4" /> Create first case study
                  </Link>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-lg font-black text-violet-600">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-950">{profile?.display_name || 'Creator'}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{profile?.headline || 'Add a professional headline to position your work.'}</p>
                </div>
              </div>

              {profile?.location && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {profile.location}</p>
              )}

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Top specializations</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile?.specializations.slice(0, 5).map((item) => (
                    <span key={item} className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700 ring-1 ring-violet-100">{item}</span>
                  ))}
                  {profile?.specializations.length === 0 && <span className="text-xs text-slate-400">No specializations listed yet.</span>}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-700">GenixSpark advantage</p>
              <h3 className="mt-2 text-base font-black tracking-tight text-slate-950">Workflow transparency = stronger trust.</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">Document the tools, prompt direction, and generation workflow behind each project. This is what differentiates you from a generic freelancer profile.</p>
              <Link to="/creator/portfolio/new" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800">
                Add workflow proof <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
