import React, { useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ApplicationPanel } from '../components/applications/ApplicationPanel';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { getCreativeBrief } from '../services/briefService';
import type { CreativeBrief } from '../types/brief';

export const BriefApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        setError('Brief not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getCreativeBrief(id);
        if (active) setBrief(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load brief.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <LoadingState message="Loading application workspace" description="Preparing brief requirements and proposal activity." />;

  if (error || !brief) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950">Application workspace unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'This brief could not be loaded.'}</p>
      </div>
    );
  }

  const isOwner = Boolean(user?.id === brief.brand_id && profile?.role === 'brand');

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-9 sm:py-12">
          <Link to={`/briefs/${brief.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to brief
          </Link>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-violet-700"><BriefcaseBusiness className="h-3.5 w-3.5" /> {isOwner ? 'Applicant review' : 'Creator application'}</span>
                <span className="text-[10px] font-semibold text-slate-400">{brief.status}</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{brief.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{isOwner ? 'Evaluate creator capability proof alongside proposal terms before you shortlist or award the work.' : 'Use your real profile and workflow evidence to make a concise, credible proposal.'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] leading-5 text-slate-500 lg:max-w-[300px]">
              <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" /><span>Applications use explicit profile, portfolio and commercial signals. No hidden AI ranking is used.</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        <div className="mb-5 flex flex-wrap gap-2">
          {brief.required_tools.map((tool) => <span key={tool} className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">{tool}</span>)}
          {brief.required_skills.map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600">{skill}</span>)}
        </div>
        <ApplicationPanel
          brief={brief}
          isOwner={isOwner}
          onAwarded={() => setBrief((current) => current ? { ...current, status: 'awarded' } : current)}
        />
      </div>
    </div>
  );
};
