import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, IndianRupee, Search, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button, getButtonClassName } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { getCreativeBrief, updateBriefStatus } from '../services/briefService';
import type { BriefStatus, CreativeBrief } from '../types/brief';

const statusClass: Record<BriefStatus, string> = {
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
  open: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  closed: 'border-slate-200 bg-slate-100 text-slate-600',
  awarded: 'border-violet-200 bg-violet-50 text-violet-700',
};

export const BriefDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!id) {
        setError('Creative brief not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getCreativeBrief(id);
        if (active) setBrief(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load creative brief.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  const isOwner = Boolean(brief && user?.id === brief.brand_id && profile?.role === 'brand');

  const marketplaceSearch = useMemo(() => {
    if (!brief) return '';
    const params = new URLSearchParams();
    brief.required_tools.forEach((tool) => params.append('tool', tool));
    brief.required_skills.forEach((skill) => params.append('skill', skill));
    if (brief.category) params.append('specialization', brief.category);
    params.set('brief', brief.id);
    return params.toString();
  }, [brief]);

  const changeStatus = async (status: BriefStatus) => {
    if (!brief || !isOwner) return;
    setUpdating(true);
    setError(null);
    try {
      await updateBriefStatus(brief.brand_id, brief.id, status);
      setBrief({ ...brief, status });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update brief status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingState message="Loading creative brief" description="Reading requirements and matching signals." />;

  if (error || !brief) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950">Creative brief unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'This brief could not be loaded.'}</p>
      </div>
    );
  }

  const budget = brief.budget_min != null || brief.budget_max != null
    ? `${brief.budget_min != null ? brief.budget_min.toLocaleString('en-IN') : '—'}–${brief.budget_max != null ? brief.budget_max.toLocaleString('en-IN') : '—'}`
    : 'Not specified';

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-10 sm:py-14">
          <Link to={isOwner ? '/dashboard/brand' : '/marketplace'} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft className="h-3.5 w-3.5" /> {isOwner ? 'Brand workspace' : 'Creator marketplace'}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] ${statusClass[brief.status]}`}>{brief.status}</span>
                {brief.category && <span className="text-xs font-semibold text-slate-400">{brief.category}</span>}
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">{brief.title}</h1>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600">{brief.description}</p>
            </div>

            <aside className="rounded-[22px] bg-[#0b1020] p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.12)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300">Commercial frame</p>
              <div className="mt-5 space-y-4">
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Budget</p><p className="mt-1 flex items-center gap-1 text-lg font-semibold"><IndianRupee className="h-4 w-4" />{budget}</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Deadline</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><CalendarDays className="h-4 w-4 text-violet-300" />{brief.deadline ? new Date(`${brief.deadline}T00:00:00`).toLocaleDateString() : 'Flexible'}</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Primary format</p><p className="mt-1 text-sm font-semibold">{brief.aspect_ratio || 'Not specified'}</p></div>
              </div>

              {brief.status === 'open' && (
                <Link to={`/marketplace?${marketplaceSearch}`} className={`${getButtonClassName({ variant: 'secondary', size: 'md', fullWidth: true })} mt-6`}>
                  <Search className="h-4 w-4" /> Find matching creators
                </Link>
              )}
            </aside>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><WandSparkles className="h-4 w-4" /></div><div><h2 className="text-sm font-semibold text-slate-950">Capability requirements</h2><p className="mt-0.5 text-[10px] text-slate-500">These are directly comparable with creator profile signals.</p></div></div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">AI tools</p><div className="mt-3 flex flex-wrap gap-2">{brief.required_tools.length ? brief.required_tools.map((tool) => <span key={tool} className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">{tool}</span>) : <span className="text-xs text-slate-400">No required toolchain</span>}</div></div>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Skills</p><div className="mt-3 flex flex-wrap gap-2">{brief.required_skills.length ? brief.required_skills.map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600">{skill}</span>) : <span className="text-xs text-slate-400">No required skills listed</span>}</div></div>
              </div>
            </section>

            <section className="surface-card rounded-[22px] p-5 sm:p-7">
              <h2 className="text-sm font-semibold text-slate-950">Delivery definition</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Deliverables</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{brief.deliverables || 'Not specified'}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Usage rights</p><p className="mt-2 text-sm leading-6 text-slate-600">{brief.usage_rights || 'Not specified'}</p></div>
              </div>
            </section>

            {brief.reference_notes && (
              <section className="surface-card rounded-[22px] p-5 sm:p-7">
                <h2 className="text-sm font-semibold text-slate-950">References & production notes</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{brief.reference_notes}</p>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="surface-card rounded-[20px] p-5">
              <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-violet-600" /><div><p className="text-xs font-semibold text-slate-950">Explainable matching ready</p><p className="mt-1 text-[10px] leading-5 text-slate-500">Tool, skill and category requirements can be passed directly into creator discovery instead of relying on an opaque ranking score.</p></div></div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Structured requirements captured</div>
            </div>

            {isOwner && (
              <div className="surface-card rounded-[20px] p-5">
                <p className="text-xs font-semibold text-slate-950">Brief controls</p>
                <p className="mt-1 text-[10px] leading-5 text-slate-500">Drafts are private. Open briefs are visible to creators.</p>
                <div className="mt-4 space-y-2">
                  {brief.status === 'draft' && <Button fullWidth size="sm" isLoading={updating} onClick={() => void changeStatus('open')} leftIcon={<Sparkles className="h-3.5 w-3.5" />}>Publish brief</Button>}
                  {brief.status === 'open' && <Button fullWidth size="sm" variant="outline" isLoading={updating} onClick={() => void changeStatus('closed')}>Close brief</Button>}
                  {brief.status === 'closed' && <Button fullWidth size="sm" variant="outline" isLoading={updating} onClick={() => void changeStatus('open')}>Reopen brief</Button>}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
