import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, IndianRupee, Send, Sparkles, UserRound, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, getButtonClassName } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  awardApplication,
  createApplication,
  getBrandApplications,
  getCreatorApplicationForBrief,
  updateApplicationStatus,
} from '../../services/applicationService';
import type { Application, ApplicationStatus, BrandApplicationRow } from '../../types/application';
import type { CreativeBrief } from '../../types/brief';

const statusClass: Record<ApplicationStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  shortlisted: 'border-sky-200 bg-sky-50 text-sky-700',
  accepted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  withdrawn: 'border-slate-200 bg-slate-100 text-slate-500',
};

const ApplicationStatusPill: React.FC<{ status: ApplicationStatus }> = ({ status }) => (
  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${statusClass[status]}`}>{status}</span>
);

interface Props {
  brief: CreativeBrief;
  isOwner: boolean;
  onAwarded?: () => void;
}

export const ApplicationPanel: React.FC<Props> = ({ brief, isOwner, onAwarded }) => {
  const { user, profile } = useAuth();
  const [existing, setExisting] = useState<Application | null>(null);
  const [applicants, setApplicants] = useState<BrandApplicationRow[]>([]);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isCreator = profile?.role === 'creator' && Boolean(user?.id);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isOwner) {
        setApplicants(await getBrandApplications(brief.id));
      } else if (isCreator && user?.id) {
        setExisting(await getCreatorApplicationForBrief(brief.id, user.id));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load application activity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brief.id, isOwner, isCreator, user?.id]);

  const pipeline = useMemo(() => ({
    total: applicants.length,
    shortlisted: applicants.filter((item) => item.status === 'shortlisted').length,
    accepted: applicants.filter((item) => item.status === 'accepted').length,
  }), [applicants]);

  const submit = async () => {
    if (!user?.id || !isCreator || existing || brief.status !== 'open') return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const application = await createApplication({
        brief_id: brief.id,
        creator_id: user.id,
        message,
        proposed_price: price.trim() ? Number(price) : null,
        currency: brief.currency || 'INR',
        expected_delivery_days: days.trim() ? Number(days) : null,
      });
      setExisting(application);
      setNotice('Application submitted. The brand can now review your fit, note, price and delivery estimate.');
      setMessage('');
      setPrice('');
      setDays('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit application.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (applicationId: string, status: ApplicationStatus) => {
    setActionId(applicationId);
    setError(null);
    setNotice(null);
    try {
      await updateApplicationStatus(applicationId, status);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update applicant.');
    } finally {
      setActionId(null);
    }
  };

  const accept = async (applicationId: string) => {
    if (!user?.id || !isOwner) return;
    setActionId(applicationId);
    setError(null);
    setNotice(null);
    try {
      await awardApplication(user.id, brief.id, applicationId);
      setNotice('Creator accepted. Remaining active applications were closed and this brief is now awarded.');
      await load();
      onAwarded?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to award this brief.');
    } finally {
      setActionId(null);
    }
  };

  if (!isOwner && !isCreator) {
    return (
      <section className="surface-card rounded-[22px] p-5 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Creator application</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">Interested in this brief?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Sign in with a creator account to submit a scoped application with your fit note, proposed price and delivery estimate.</p>
        <Link to="/auth" className={`${getButtonClassName({ size: 'sm' })} mt-5`}>Sign in to apply</Link>
      </section>
    );
  }

  return (
    <section className="surface-card rounded-[22px] p-5 sm:p-7">
      {(error || notice) && (
        <div className={`mb-5 rounded-xl border px-4 py-3 text-xs font-semibold ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || notice}
        </div>
      )}

      {isOwner ? (
        <>
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Applicant pipeline</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">Review creator proposals with context.</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">Shortlist first, then award the brief when capability proof and commercial terms align.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['Applicants', pipeline.total], ['Shortlist', pipeline.shortlisted], ['Accepted', pipeline.accepted]].map(([label, value]) => (
                <div key={String(label)} className="min-w-[74px] rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-lg font-semibold text-slate-950">{value}</p>
                  <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-xs text-slate-400">Loading applicants…</p>
          ) : applicants.length === 0 ? (
            <div className="py-10 text-center">
              <UserRound className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No applications yet</p>
              <p className="mt-1 text-xs text-slate-400">Open briefs can receive one application per creator.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {applicants.map((application) => (
                <article key={application.id} className="rounded-[18px] border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50 text-violet-700">
                        {application.creator?.avatar_url ? <img src={application.creator.avatar_url} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link to={`/creators/${application.creator_id}`} className="text-sm font-bold text-slate-950 hover:text-violet-700">{application.creator?.display_name || 'Creator'}</Link>
                          <ApplicationStatusPill status={application.status} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{application.creator?.headline || 'No headline yet'}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(application.creator?.ai_tools || []).slice(0, 4).map((tool) => <span key={tool} className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">{tool}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-5 text-xs">
                      <div><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Proposal</p><p className="mt-1 flex items-center gap-1 font-semibold text-slate-900"><IndianRupee className="h-3 w-3" />{application.proposed_price != null ? application.proposed_price.toLocaleString('en-IN') : 'Flexible'}</p></div>
                      <div><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Delivery</p><p className="mt-1 flex items-center gap-1 font-semibold text-slate-900"><Clock3 className="h-3 w-3" />{application.expected_delivery_days ? `${application.expected_delivery_days} days` : 'Flexible'}</p></div>
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">{application.message || 'No application note supplied.'}</p>
                  {brief.status === 'open' && application.status !== 'accepted' && application.status !== 'rejected' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {application.status !== 'shortlisted' && <Button size="sm" variant="outline" isLoading={actionId === application.id} onClick={() => void changeStatus(application.id, 'shortlisted')} leftIcon={<Sparkles className="h-3.5 w-3.5" />}>Shortlist</Button>}
                      <Button size="sm" isLoading={actionId === application.id} onClick={() => void accept(application.id)} leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}>Accept creator</Button>
                      <Button size="sm" variant="ghost" disabled={actionId === application.id} onClick={() => void changeStatus(application.id, 'rejected')} leftIcon={<XCircle className="h-3.5 w-3.5" />}>Reject</Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Send className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">Creator application</p>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">Turn your capability proof into a clear proposal.</h2>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-xs text-slate-400">Checking application status…</p>
          ) : existing ? (
            <div className="mt-6 rounded-[18px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-sm font-bold text-slate-950">Application submitted</p><p className="mt-1 text-xs text-slate-500">The brand can review your creator profile and proposal.</p></div>
                <ApplicationStatusPill status={existing.status} />
              </div>
              <p className="mt-4 whitespace-pre-line text-xs leading-6 text-slate-600">{existing.message}</p>
              <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-600">
                <span>Price: <strong>{existing.proposed_price != null ? `${existing.currency} ${existing.proposed_price.toLocaleString('en-IN')}` : 'Flexible'}</strong></span>
                <span>Delivery: <strong>{existing.expected_delivery_days ? `${existing.expected_delivery_days} days` : 'Flexible'}</strong></span>
              </div>
              <Link to="/creator/applications" className="mt-4 inline-flex text-[11px] font-bold text-violet-700 hover:text-violet-800">Track all applications →</Link>
            </div>
          ) : brief.status !== 'open' ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-500">This brief is no longer accepting applications.</div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div className="lg:row-span-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Why you fit</label>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200} rows={6} placeholder="Connect your real toolchain, workflow proof and relevant portfolio experience to this brief. Avoid generic claims." className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Proposed price</label>
                <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Delivery days</label>
                <input value={days} onChange={(event) => setDays(event.target.value)} inputMode="numeric" placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50" />
              </div>
              <div className="lg:col-span-2 flex items-end"><Button fullWidth isLoading={saving} disabled={!message.trim()} onClick={() => void submit()} leftIcon={<Send className="h-4 w-4" />}>Submit application</Button></div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
