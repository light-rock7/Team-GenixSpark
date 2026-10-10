import React from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const pageMeta = (pathname: string) => {
  if (pathname.includes('/creator/profile')) return { label: 'Creator profile', description: 'Identity, positioning and marketplace signals' };
  if (pathname.includes('/creator/portfolio/new')) return { label: 'New portfolio case study', description: 'Document the work and the workflow behind it' };
  if (pathname.includes('/creator/portfolio')) return { label: 'AI portfolio', description: 'Manage published work and private drafts' };
  if (pathname.startsWith('/creators/')) return { label: 'Public profile preview', description: 'How brands see your creator presence' };
  return { label: 'Creator studio', description: 'Portfolio strength, workflow proof and marketplace readiness' };
};

export const CreatorWorkspaceNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const meta = pageMeta(location.pathname);

  return (
    <div className="border-b border-slate-200/80 bg-white">
      <div className="page-shell flex min-h-[68px] items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-[-0.025em] text-slate-950">{meta.label}</p>
            <p className="mt-0.5 hidden truncate text-[10px] text-slate-400 sm:block">{meta.description}</p>
          </div>
        </div>

        {user?.id && !location.pathname.startsWith('/creators/') && (
          <Link
            to={`/creators/${user.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <Eye className="h-3.5 w-3.5" />
            Public profile
          </Link>
        )}
      </div>
    </div>
  );
};