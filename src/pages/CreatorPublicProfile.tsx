import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Images,
  MapPin,
  Pencil,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { PortfolioCard } from '../components/creator/PortfolioCard';
import { getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { getPublicCreatorView } from '../services/creatorService';
import type { CreatorPublicView } from '../types/creator';

const availabilityCopy = {
  available: { label: 'Available for briefs', dot: 'bg-emerald-400', text: 'text-emerald-100', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  busy: { label: 'Limited availability', dot: 'bg-amber-400', text: 'text-amber-100', bg: 'bg-amber-400/10 border-amber-400/20' },
  unavailable: { label: 'Currently unavailable', dot: 'bg-slate-400', text: 'text-slate-200', bg: 'bg-white/5 border-white/10' },
};

export const CreatorPublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile: authProfile } = useAuth();
  const [view, setView] = useState<CreatorPublicView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        setError('Creator profile not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await getPublicCreatorView(id);
        if (active) setView(result);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load creator profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  const isOwnProfile = Boolean(user?.id && id === user.id && authProfile?.role === 'creator');

  if (loading) {
    return <LoadingState message="Opening creator profile" description="Loading portfolio work and AI workflow details." />;
  }

  if (error || !view) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">Creator profile unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'This creator profile could not be loaded.'}</p>
        <Link to="/" className={`${getButtonClassName({ variant: 'outline', size: 'md' })} mt-6`}>
          Back to GenixSpark
        </Link>
      </div>
    );
  }

  const { profile, portfolio } = view;
  const availability = availabilityCopy[profile.availability];

  return (
    <div className="min-h-full bg-slate-50">
      {isOwnProfile && <CreatorWorkspaceNav />}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,.48),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,.25),transparent_30%),linear-gradient(135deg,#020617,#111827_52%,#1e1b4b)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:items-end">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl flex items-center justify-center text-3xl font-black text-violet-100 backdrop-blur">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
                  ) : (
                    profile.display_name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-100">
                      <Sparkles className="h-3 w-3" /> Verified AI creator profile
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${availability.bg} ${availability.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${availability.dot}`} />
                      {availability.label}
                    </span>
                  </div>
                  <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white">
                    {profile.display_name}
                  </h1>
                  <p className="mt-2 max-w-3xl text-base sm:text-lg font-medium leading-relaxed text-slate-300">
                    {profile.headline || 'Generative AI creator on GenixSpark'}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                    {profile.location && (
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
                    )}
                    <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="h-3.5 w-3.5" /> {profile.years_experience} years experience</span>
                    {profile.hourly_rate != null && (
                      <span className="font-semibold text-slate-300">₹{profile.hourly_rate.toLocaleString('en-IN')}/hr indicative</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {profile.ai_tools.map((tool) => (
                  <span key={tool} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur">
                    <WandSparkles className="h-3.5 w-3.5 text-violet-300" /> {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur-xl shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">Creator snapshot</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-3.5">
                  <p className="text-2xl font-black">{portfolio.length}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">Published works</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-3.5">
                  <p className="text-2xl font-black">{profile.ai_tools.length}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">AI tools</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {isOwnProfile ? (
                  <>
                    <Link to="/creator/profile" className={getButtonClassName({ variant: 'primary', size: 'md', fullWidth: true })}>
                      <Pencil className="h-4 w-4" /> Edit profile
                    </Link>
                    <Link to="/creator/portfolio" className={`${getButtonClassName({ variant: 'secondary-dark', size: 'md', fullWidth: true })} border-white/10`}>
                      <Images className="h-4 w-4" /> Manage portfolio
                    </Link>
                  </>
                ) : profile.website_url ? (
                  <a href={profile.website_url} target="_blank" rel="noreferrer" className={getButtonClassName({ variant: 'primary', size: 'md', fullWidth: true })}>
                    Visit creator website <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-slate-400">
                    Brand collaboration actions will appear with creative briefs.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
          <main>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Sparkles className="h-4 w-4" /></span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">About the creator</p>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Creative point of view</h2>
                </div>
              </div>
              <p className="mt-5 whitespace-pre-line text-sm sm:text-base leading-7 text-slate-600">
                {profile.bio || 'This creator has not added a full bio yet.'}
              </p>
            </section>

            <section className="mt-8">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">Selected work</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">AI portfolio & workflow proof</h2>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                  <Images className="h-3.5 w-3.5" /> {portfolio.length} works
                </span>
              </div>

              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.map((item) => <PortfolioCard key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Images className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-800">Portfolio coming soon</p>
                  <p className="mt-1 text-xs text-slate-500">This creator has not published portfolio work yet.</p>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Capabilities</p>
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-900">Specializations</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.specializations.length > 0 ? profile.specializations.map((item) => (
                    <span key={item} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">{item}</span>
                  )) : <span className="text-xs text-slate-400">Not specified</span>}
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold text-slate-900">Skills</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.skills.length > 0 ? profile.skills.map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{item}</span>
                  )) : <span className="text-xs text-slate-400">Not specified</span>}
                </div>
              </div>
            </div>

            {(profile.website_url || profile.social_url) && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Links</p>
                <div className="mt-4 space-y-2">
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors">
                      <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> Website</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {profile.social_url && (
                    <a href={profile.social_url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors">
                      <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Social / professional</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
