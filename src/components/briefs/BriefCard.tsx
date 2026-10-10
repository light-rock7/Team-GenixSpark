import React from 'react';
import { CalendarDays, ExternalLink, IndianRupee, Trash2, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BriefStatus, CreativeBrief } from '../../types/brief';

const statusClass: Record<BriefStatus, string> = {
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
  open: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  closed: 'border-slate-200 bg-slate-100 text-slate-600',
  awarded: 'border-violet-200 bg-violet-50 text-violet-700',
};

interface BriefCardProps {
  brief: CreativeBrief;
  editable?: boolean;
  onStatusChange?: (brief: CreativeBrief, status: BriefStatus) => void;
  onDelete?: (brief: CreativeBrief) => void;
}

export const BriefCard: React.FC<BriefCardProps> = ({ brief, editable = false, onStatusChange, onDelete }) => {
  const budget = brief.budget_min != null || brief.budget_max != null
    ? `${brief.budget_min != null ? brief.budget_min.toLocaleString('en-IN') : '—'}–${brief.budget_max != null ? brief.budget_max.toLocaleString('en-IN') : '—'}`
    : null;

  return (
    <article className="surface-card rounded-[22px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${statusClass[brief.status]}`}>
              {brief.status}
            </span>
            {brief.category && <span className="text-[10px] font-semibold text-slate-400">{brief.category}</span>}
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-slate-950">{brief.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{brief.description}</p>
        </div>
        <Link to={`/briefs/${brief.id}`} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-700" aria-label={`Open ${brief.title}`}>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {brief.required_tools.slice(0, 3).map((tool) => (
          <span key={tool} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">
            <WandSparkles className="h-3 w-3" /> {tool}
          </span>
        ))}
        {brief.required_skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">{skill}</span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-[10px] text-slate-500 sm:grid-cols-3">
        <div>
          <p className="font-semibold uppercase tracking-[0.1em] text-slate-400">Budget</p>
          <p className="mt-1 flex items-center gap-1 font-semibold text-slate-700"><IndianRupee className="h-3 w-3" />{budget || 'Not set'}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.1em] text-slate-400">Deadline</p>
          <p className="mt-1 flex items-center gap-1 font-semibold text-slate-700"><CalendarDays className="h-3 w-3" />{brief.deadline ? new Date(`${brief.deadline}T00:00:00`).toLocaleDateString() : 'Flexible'}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="font-semibold uppercase tracking-[0.1em] text-slate-400">Format</p>
          <p className="mt-1 font-semibold text-slate-700">{brief.aspect_ratio || 'Not specified'}</p>
        </div>
      </div>

      {editable && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {brief.status === 'draft' && (
            <button type="button" onClick={() => onStatusChange?.(brief, 'open')} className="rounded-lg bg-slate-950 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-700">Publish brief</button>
          )}
          {brief.status === 'open' && (
            <button type="button" onClick={() => onStatusChange?.(brief, 'closed')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 hover:border-slate-300">Close brief</button>
          )}
          {brief.status === 'closed' && (
            <button type="button" onClick={() => onStatusChange?.(brief, 'open')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-700">Reopen</button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete “${brief.title}”? This cannot be undone.`)) onDelete?.(brief);
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </article>
  );
};
