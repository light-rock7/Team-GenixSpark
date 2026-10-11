import React, { useEffect, useState } from 'react';
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
import { Link, useParams } from 'react-router-dom';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { PortfolioCard } from '../components/creator/PortfolioCard';
import { getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { getPublicCreatorView } from '../services/creatorService';
import type { CreatorPublicView } from '../types/creator';

const availabilityCopy = {
  available: { label: 'Available for briefs', dot: 'bg-emerald-500', pill: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  busy: { label: 'Limited availability', dot: 'bg-amber-500', pill: 'border-amber-200 bg-amber-50 text-amber-700' },
  unavailable: { label: 'Currently unavailable', dot: 'bg-slate-400', pill: 'border-slate-200 bg-slate-100 text-slate-600' },
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
        const data = await getPublicCreatorView(id);
        if (active) setView(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load creator profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  const isOwner = Boolean(user?.id && id === user.id && authProfile?.role === 'creator');

  if (loading) {
    return <LoadingState message="Loading creator profile" description="Preparing portfolio and workflow evidence." />;
  }

  if (error || !view) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-slate-950">Creator profile unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'This creator profile could not be loaded.'}</p>
      </div>
    );
  }

  const { profile, portfolio } = view;
  const availability = availabilityCopy[profile.availability];

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      {isOwner && <CreatorWorkspaceNav />}

      <section className="border-b border-slate-200/80 bg-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-violet-100 to-slate-100 text-3xl font-extrabold text-violet-600 shadow-sm">
                {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" /> : profile.display_name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">{profile.display_name}</h1>
                  <CheckCircle2 className="h-5 w-5 text-violet-600" />
                </div>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">{profile.headline || 'AI creator on GenixSpark'}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold ${availability.pill}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${availability.dot}`} /> {availability.label}
                  </span>
                  {profile.location && <span className="inline-flex items-center gap-1.5 text-slate-500"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>}
                  {profile.years_experience > 0 && <span className="text-slate-500">{profile.years_experience}+ years experience</span>}
                </div>

                {profile.bio && <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600">{profile.bio}</p>}
              </div>
            </div>

            <aside className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Creator signal</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{portfolio.length}</p><p className="mt-1 text-[9px] text-slate-400">Published</p></div>
                <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{profile.ai_tools.length}</p><p className="mt-1 text-[9px] text-slate-400">AI tools</p></div>
                <div><p className="text-xl font-extrabold tracking-[-0.04em] text-slate-950">{profile.specializations.length}</p><p className="mt-1 text-[9px] text-slate-400">Focus areas</p></div>
              </div>
              <div className="mt-5 border-t border-slate-200 pt-4">
                {profile.hourly_rate != null && (
                  <p className="text-sm font-extrabold text-slate-950">₹{profile.hourly_rate.toLocaleString('en-IN')} <span className="text-[10px] font-medium text-slate-400">indicative / hour</span></p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-violet-700">
                      <Globe2 className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {profile.social_url && (
                    <a href={profile.social_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-violet-700">
                      Profile link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              {isOwner && (
                <Link to="/creator/profile" className={`${getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })} mt-5`}>
                  <Pencil className="h-3.5 w-3.5" /> Edit profile
                </Link>
              )}
            </aside>
          </div>

          <div className="mt-8 grid gap-5 border-t border-slate-100 pt-7 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">AI tools</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.ai_tools.length > 0 ? profile.ai_tools.map((tool) => <span key={tool} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1.5 text-[9px] font-semibold text-violet-700"><WandSparkles className="h-3 w-3" /> {tool}</span>) : <span className="text-xs text-slate-400">Not listed</span>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Skills</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.skills.length > 0 ? profile.skills.map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-slate-600">{skill}</span>) : <span className="text-xs text-slate-400">Not listed</span>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Specializations</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.specializations.length > 0 ? profile.specializations.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[9px] font-semibold text-slate-600">{item}</span>) : <span className="text-xs text-slate-400">Not listed</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Selected work</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-950">Portfolio case studies</h2>
            <p className="mt-1.5 text-sm text-slate-500">Finished work paired with the tools and workflow behind it.</p>
          </div>
          {!isOwner && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-500 shadow-sm">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-600" /> Review workflow evidence before inviting to a brief
            </div>
          )}
        </div>

        {portfolio.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {portfolio.map((item) => <PortfolioCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Images className="h-5 w-5" /></div>
            <h3 className="mt-4 text-base font-extrabold text-slate-950">No published work yet</h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">Published portfolio case studies will appear here.</p>
            {isOwner && (
              <Link to="/creator/portfolio/new" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800">Add case study <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            )}
          </div>
        )}
      </section>

      <section className="border-t border-slate-200/80 bg-white py-10">
        <div className="page-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-violet-300"><Sparkles className="h-4 w-4" /></div>
            <div><p className="text-xs font-extrabold text-slate-950">GenixSpark creator profile</p><p className="mt-0.5 text-[10px] text-slate-400">AI tool fluency · portfolio proof · workflow transparency</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};