import React from 'react';
import {
  Eye,
  EyeOff,
  ExternalLink,
  Play,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import type { PortfolioItem } from '../../types/creator';

interface PortfolioCardProps {
  item: PortfolioItem;
  editable?: boolean;
  onTogglePublished?: (item: PortfolioItem) => void;
  onDelete?: (item: PortfolioItem) => void;
  compact?: boolean;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  item,
  editable = false,
  onTogglePublished,
  onDelete,
  compact = false,
}) => {
  const primaryTool = item.ai_tools[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <div className={`relative overflow-hidden bg-slate-950 ${compact ? 'aspect-[4/3]' : 'aspect-[16/11]'}`}>
        {item.media_type === 'image' && (
          <img
            src={item.thumbnail_url || item.media_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {item.media_type === 'video' && (
          <>
            <video
              src={item.media_url}
              poster={item.thumbnail_url || undefined}
              className="h-full w-full object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/90 text-slate-900 shadow-lg backdrop-blur">
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </div>
            </div>
          </>
        )}

        {item.media_type === 'link' && (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.35),_transparent_45%),linear-gradient(135deg,#0f172a,#1e1b4b_55%,#312e81)] flex items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-violet-200 backdrop-blur">
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">External showcase</p>
              <p className="mt-2 text-sm font-semibold text-white/90">Open the live project or case study</p>
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-md ${
            item.is_published
              ? 'border-emerald-300/50 bg-emerald-950/65 text-emerald-100'
              : 'border-amber-300/50 bg-amber-950/65 text-amber-100'
          }`}>
            {item.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {item.is_published ? 'Published' : 'Draft'}
          </span>
        </div>

        <a
          href={item.media_url}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-slate-950/55 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-white hover:text-slate-950"
          aria-label={`Open ${item.title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
        {item.category && (
          <span className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-slate-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur">
            {item.category}
          </span>
        )}
      </div>

      <div className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
              {item.title}
            </h3>
            {item.description && !compact && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {item.description}
              </p>
            )}
          </div>
          {primaryTool && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">
              <WandSparkles className="h-3 w-3" />
              {primaryTool}
            </span>
          )}
        </div>

        {!compact && (item.ai_tools.length > 1 || item.skills.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.ai_tools.slice(1, 4).map((tool) => (
              <span key={tool} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                {tool}
              </span>
            ))}
            {item.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                {skill}
              </span>
            ))}
          </div>
        )}

        {!compact && (item.prompt_summary || item.workflow_summary) && (
          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-700">
              <Sparkles className="h-3 w-3" />
              Workflow transparency
            </p>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {item.workflow_summary || item.prompt_summary}
            </p>
          </div>
        )}

        {editable && (
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onTogglePublished?.(item)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              {item.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {item.is_published ? 'Move to draft' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete “${item.title}”? This cannot be undone.`)) {
                  onDelete?.(item);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
