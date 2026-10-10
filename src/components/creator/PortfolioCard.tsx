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
    <article className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_42px_rgba(15,23,42,.08)]">
      <div className={`relative overflow-hidden bg-slate-950 ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        {item.media_type === 'image' && (
          <img
            src={item.thumbnail_url || item.media_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            loading="lazy"
          />
        )}

        {item.media_type === 'video' && (
          <>
            <video src={item.media_url} poster={item.thumbnail_url || undefined} className="h-full w-full object-cover" muted preload="metadata" />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/15">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/90 text-slate-950 shadow-lg backdrop-blur">
                <Play className="ml-0.5 h-4.5 w-4.5 fill-current" />
              </div>
            </div>
          </>
        )}

        {item.media_type === 'link' && (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_10%,rgba(109,74,255,.42),transparent_38%),linear-gradient(145deg,#0b1020,#18182f)] p-8 text-center">
            <div>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-violet-200">
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200">External case study</p>
              <p className="mt-1.5 text-xs text-slate-300">Open the live work</p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] backdrop-blur-md ${
            item.is_published
              ? 'border-white/15 bg-slate-950/60 text-white'
              : 'border-amber-200/30 bg-amber-950/60 text-amber-100'
          }`}>
            {item.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {item.is_published ? 'Published' : 'Draft'}
          </span>
        </div>

        <a
          href={item.media_url}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-white/15 bg-slate-950/55 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-white hover:text-slate-950"
          aria-label={`Open ${item.title}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {item.category && (
          <span className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/55 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur">
            {item.category}
          </span>
        )}
      </div>

      <div className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold tracking-[-0.025em] text-slate-950 sm:text-base">{item.title}</h3>
            {item.description && !compact && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>
            )}
          </div>
          {primaryTool && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-bold text-violet-700 ring-1 ring-violet-100">
              <WandSparkles className="h-3 w-3" /> {primaryTool}
            </span>
          )}
        </div>

        {!compact && (item.ai_tools.length > 1 || item.skills.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.ai_tools.slice(1, 4).map((tool) => (
              <span key={tool} className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-600">{tool}</span>
            ))}
            {item.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-500">{skill}</span>
            ))}
          </div>
        )}

        {!compact && (item.prompt_summary || item.workflow_summary) && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-violet-700">
              <Sparkles className="h-3 w-3" /> Workflow note
            </p>
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-slate-500">{item.workflow_summary || item.prompt_summary}</p>
          </div>
        )}

        {editable && (
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onTogglePublished?.(item)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              {item.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {item.is_published ? 'Make draft' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete “${item.title}”? This cannot be undone.`)) onDelete?.(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};