import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Clock3, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorWorkspaceNav } from '../components/creator/CreatorWorkspaceNav';
import { LoadingState } from '../components/ui/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { getCreatorApplications } from '../services/applicationService';
import type { ApplicationStatus, CreatorApplicationRow } from '../types/application';

const statusClass: Record<ApplicationStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  shortlisted: 'border-sky-200 bg-sky-50 text-sky-700',
  accepted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  withdrawn: 'border-slate-200 bg-slate-100 text-slate-500',
};

export const CreatorApplications: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CreatorApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getCreatorApplications(user.id);
        if (active) setItems(data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load applications.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [user?.id]);

  const counts = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.status === 'pending' || item.status === 'shortlisted').length,
    accepted: items.filter((item) => item.status === 'accepted').length,
  }), [items]);

  if (loading) return <><CreatorWorkspaceNav /><LoadingState message="Loading applications" description="Reading your live brief pipeline." /></>;

  return (
    <div className="min-h-full bg-[#f7f8fb]">
      <CreatorWorkspaceNav />
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Application pipeline</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Track where every creator proposal stands.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">Your application status is visible without inventing opaque ranking scores or hidden marketplace signals.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['Total', counts.total], ['Active', counts.active], ['Accepted', counts.accepted]].map(([label, value]) => (
                <div key={String(label)} className="min-w-[86px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                  <p className="text-xl font-semibold text-slate-950">{value}</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-8 sm:py-10">
        {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">{error}</div>}

        {items.length === 0 ? (
          <div className="surface-card rounded-[22px] px-6 py-14 text-center">
            <BriefcaseBusiness className="mx-auto h-7 w-7 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No applications yet</h2>
            <p className="mt-2 text-sm text-slate-500">Browse live briefs and submit a proposal grounded in your real workflow proof.</p>
            <Link to="/opportunities" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-violet-700">Browse opportunities <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((application) => (
              <article key={application.id} className="surface-card rounded-[20px] p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${statusClass[application.status]}`}>{application.status}</span>
                      <span className="text-[9px] text-slate-400">Applied {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">{application.brief?.title || 'Brief no longer publicly visible'}</h2>
                    <p className="mt-2 max-w-3xl whitespace-pre-line text-xs leading-6 text-slate-500">{application.message || 'No application note supplied.'}</p>
                  </div>
                  <div className="flex shrink-0 gap-5 text-xs">
                    <div><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Proposal</p><p className="mt-1 flex items-center gap-1 font-semibold text-slate-900"><IndianRupee className="h-3 w-3" />{application.proposed_price != null ? application.proposed_price.toLocaleString('en-IN') : 'Flexible'}</p></div>
                    <div><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Delivery</p><p className="mt-1 flex items-center gap-1 font-semibold text-slate-900"><Clock3 className="h-3 w-3" />{application.expected_delivery_days ? `${application.expected_delivery_days} days` : 'Flexible'}</p></div>
                  </div>
                </div>
                {application.brief && <Link to={`/briefs/${application.brief_id}`} className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:text-violet-800">Open brief <ArrowRight className="h-3.5 w-3.5" /></Link>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
