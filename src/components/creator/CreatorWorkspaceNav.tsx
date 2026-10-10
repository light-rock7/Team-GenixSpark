import React from 'react';
import { Eye, Images, LayoutDashboard, Sparkles, UserRound, WandSparkles } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const pageMeta = (pathname: string) => {
  if (pathname.includes('/creator/copilot')) return { label: 'Creator Copilot', description: 'AI guidance grounded in your profile and workflow proof' };
  if (pathname.includes('/creator/profile')) return { label: 'Creator profile', description: 'Identity, positioning and marketplace signals' };
  if (pathname.includes('/creator/portfolio/new')) return { label: 'New case study', description: 'Document the work and workflow behind it' };
  if (pathname.includes('/creator/portfolio')) return { label: 'AI portfolio', description: 'Published work, drafts and workflow proof' };
  if (pathname.startsWith('/creators/')) return { label: 'Public profile', description: 'How brands see your creator presence' };
  return { label: 'Creator studio', description: 'Profile strength, portfolio proof and marketplace readiness' };
};

export const CreatorWorkspaceNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const meta = pageMeta(location.pathname);

  const navItems = [
    { to: '/dashboard/creator', label: 'Overview', icon: LayoutDashboard },
    { to: '/creator/profile', label: 'Profile', icon: UserRound },
    { to: '/creator/copilot', label: 'AI Copilot', icon: WandSparkles },
    { to: '/creator/portfolio', label: 'Portfolio', icon: Images },
    ...(user?.id ? [{ to: `/creators/${user.id}`, label: 'Public view', icon: Eye }] : []),
  ];

  return (
    <div className="border-b border-slate-200/80 bg-white">
      <div className="page-shell flex min-h-[68px] flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-[-0.02em] text-slate-950">{meta.label}</p>
            <p className="mt-0.5 hidden truncate text-[10px] text-slate-400 lg:block">{meta.description}</p>
          </div>
        </div>

        <nav className="no-scrollbar -mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1" aria-label="Creator workspace">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard/creator'}
              className={({ isActive }) => `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};