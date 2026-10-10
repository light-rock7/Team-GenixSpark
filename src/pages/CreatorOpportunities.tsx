import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, IndianRupee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { LoadingState } from '../components/ui/LoadingState';
import { useCreatorProfile } from '../hooks/useCreatorProfile';
import { getOpenBriefs } from '../services/briefService';
import type { CreativeBrief } from '../types/brief';

const lowerSet = (items: string[]) => new Set(items.map((item) => item.trim().toLowerCase()).filter(Boolean));

export const CreatorOpportunities: React.FC = () => {
  const { profile, loading: profileLoading, error: profileError } = useCreatorProfile();
  const [briefs, setBriefs] = useState<CreativeBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getOpenBriefs();
        if (active) setBriefs(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load opportunities.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const ranked = useMemo(() => {
    const tools = lowerSet(profile?.ai_tools || []);
    const skills = lowerSet(profile?.skills || []);
    const focus = lowerSet(profile?.specializations || []);

    return briefs.map((brief) => {
      const matchedTools = brief.required_tools.filter((item) => tools.has(item.toLowerCase()));
      const matchedSkills = brief.required_skills.filter((item) => skills.has(item.toLowerCase()));
      const categoryMatch = Boolean(brief.category && focus.has(brief.category.toLowerCase()));
      const totalCriteria = brief.required_tools.length + brief.required_skills.length + (brief.category ? 1 : 0);
      const matchedCriteria = matchedTools.length + matchedSkills.length + (categoryMatch ? 1 : 0);
      const fit = totalCriteria > 0 ? Math.round((matchedCriteria / totalCriteria) * 100) : null;
      const reasons = [
        matchedTools.length ? `${matchedTools.length} tool match${matchedTools.length > 1 ? 'es' : ''}` : '',
        matchedSkills.length ? `${matchedSkills.length} skill match${matchedSkills.length > 1 ? 'es' : ''}` : '',
        categoryMatch ? 'specialization match' : '',
      ].filter(Boolean);
      return { brief, fit, reasons };
    }).sort((a, b) => (b.fit ?? -1) - (a.fit ?? -1));
  }, [briefs, profile]);

  if (loading || profileLoading) return <><CreatorWorkspaceNav /><LoadingState message="Finding live briefs" description="Comparing open requirements with your creator capability signals." /></>;

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700"><BriefcaseBusiness className="h-3.5 w-3.5" /> Live opportunities</div>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Briefs ranked by signals you actually claim.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Fit is deterministic: required AI tools, skills and specialization are compared with your creator profile. No criteria means no artificial score.</p>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        {(error || profileError) && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{error || profileError}</div>}

        {ranked.length === 0 ? (
          <div className="surface-card rounded-[22px] px-6 py-14 text-center">
            <BriefcaseBusiness className="mx-auto h-7 w-7 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No open briefs right now</h2>
            <p className="mt-2 text-sm text-slate-500">New brand briefs will appear here after they are published.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {ranked.map(({ brief, fit, reasons }) => {
              const budget = brief.budget_min != null || brief.budget_max != null
                ? `${brief.currency} ${brief.budget_min?.toLocaleString('en-IN') || '—'}–${brief.budget_max?.toLocaleString('en-IN') || '—'}`
                : 'Budget flexible';
              return (
                <article key={brief.id} className="surface-card rounded-[22px] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {brief.category && <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-violet-600">{brief.category}</span>}
                        <span className="text-[9px] text-slate-400">Open</span>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">{brief.title}</h2>
                    </div>
                    {fit != null && (
                      <div className="shrink-0 rounded-xl bg-slate-950 px-3 py-2 text-center text-white">
                        <p className="text-lg font-semibold">{fit}%</p>
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">criteria fit</p>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-500">{brief.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {brief.required_tools.slice(0, 4).map((tool) => <span key={tool} className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">{tool}</span>)}
                    {brief.required_skills.slice(0, 3).map((skill) => <span key={skill} className="rounded-full border border-slate-200 px-2.5 py-1 text-[9px] font-semibold text-slate-600">{skill}</span>)}
                  </div>

                  {reasons.length > 0 && <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-[10px] font-semibold text-emerald-700"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />Why it fits: {reasons.join(' · ')}</div>}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{budget.replace('INR ', '')}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{brief.deadline ? new Date(`${brief.deadline}T00:00:00`).toLocaleDateString() : 'Flexible deadline'}</span>
                    </div>
                    <Link to={`/briefs/${brief.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:text-violet-800">View & apply <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
