import React from 'react';
import { ArrowUpRight, BriefcaseBusiness, Images, MapPin, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DiscoveryResult } from '../../types/discovery';

interface CreatorDiscoveryCardProps {
  result: DiscoveryResult;
}

const availabilityStyles = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  busy: 'border-amber-200 bg-amber-50 text-amber-700',
  unavailable: 'border-slate-200 bg-slate-100 text-slate-500',
};

const availabilityLabels = {
  available: 'Available',
  busy: 'Limited',
  unavailable: 'Unavailable',
};

export const CreatorDiscoveryCard: React.FC<CreatorDiscoveryCardProps> = ({ result }) => {
  const { creator, match } = result;

  return (
    <article className="group flex h-full flex-col rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_38px_rgba(15,23,42,.07)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-100 to-slate-100 text-lg font-semibold text-violet-600">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.display_name} className="h-full w-full object-cover" />
            ) : (
              creator.display_name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <Link to={`/creators/${creator.user_id}`} className="block truncate text-base font-semibold tracking-[-0.02em] text-slate-950 hover:text-violet-700">
              {creator.display_name}
            </Link>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{creator.headline || 'AI creator on GenixSpark'}</p>
          </div>
        </div>

        {match.score != null && (
          <div className="shrink-0 rounded-xl bg-slate-950 px-3 py-2 text-right text-white">
            <p className="text-sm font-semibold tracking-[-0.02em]">{match.score}%</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-slate-400">criteria fit</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px]">
        <span className={`rounded-full border px-2.5 py-1 font-semibold ${availabilityStyles[creator.availability]}`}>
          {availabilityLabels[creator.availability]}
        </span>
        {creator.location && (
          <span className="inline-flex items-center gap-1 text-slate-400">
            <MapPin className="h-3 w-3" /> {creator.location}
          </span>
        )}
        {creator.years_experience > 0 && (
          <span className="inline-flex items-center gap-1 text-slate-400">
            <BriefcaseBusiness className="h-3 w-3" /> {creator.years_experience}+ yrs
          </span>
        )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">AI toolchain</p>
        <div className="mt-2.5 flex min-h-7 flex-wrap gap-1.5">
          {creator.ai_tools.length > 0 ? creator.ai_tools.slice(0, 4).map((tool) => (
            <span key={tool} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">
              <WandSparkles className="h-2.5 w-2.5" /> {tool}
            </span>
          )) : (
            <span className="text-[10px] text-slate-400">Toolchain not listed yet</span>
          )}
        </div>
      </div>

      {creator.specializations.length > 0 && (
        <div className="mt-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Focus</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {creator.specializations.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-medium text-slate-600">{item}</span>
            ))}
          </div>
        </div>
      )}

      {match.reasons.length > 0 && (
        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 px-3.5 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-violet-600">Why this matches</p>
          <p className="mt-1.5 text-[10px] leading-4 text-slate-600">{match.reasons.join(' · ')}</p>
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="inline-flex items-center gap-1.5"><Images className="h-3.5 w-3.5" /> {creator.portfolio_count} case {creator.portfolio_count === 1 ? 'study' : 'studies'}</span>
          {creator.hourly_rate != null && <span>₹{creator.hourly_rate.toLocaleString('en-IN')}/hr</span>}
        </div>
        <Link to={`/creators/${creator.user_id}`} className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:text-violet-700">
          View profile <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};
