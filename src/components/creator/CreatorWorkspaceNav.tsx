import React from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, Images, LayoutDashboard, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard/creator', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/creator/profile', label: 'Profile', icon: UserRound, end: false },
  { to: '/creator/portfolio', label: 'Portfolio', icon: Images, end: false },
];

export const CreatorWorkspaceNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto py-3 no-scrollbar">
          <div className="flex items-center gap-2 shrink-0 pr-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-violet-200">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-extrabold tracking-tight text-slate-900">Creator Studio</p>
              <p className="text-[10px] font-medium text-slate-500">Profile & AI portfolio workspace</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200/70 shrink-0">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
            {user?.id && (
              <NavLink
                to={`/creators/${user.id}`}
                className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Public view
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
