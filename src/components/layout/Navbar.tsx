import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, getButtonClassName } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) console.error('Failed to sign out:', error.message);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const creatorLinks = user && profile?.role === 'creator' ? [
    { to: '/dashboard/creator', label: 'Studio', icon: LayoutDashboard },
    { to: '/creator/profile', label: 'Profile', icon: UserRound },
    { to: '/creator/portfolio', label: 'Portfolio', icon: Images },
    { to: `/creators/${user.id}`, label: 'Public View', icon: Eye },
  ] : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-violet-700 flex items-center justify-center text-white shadow-sm shadow-violet-200/60 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-violet-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-950 flex items-center gap-1.5">
                GenixSpark
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">Creator Marketplace</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {creatorLinks ? (
              creatorLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Explore</Link>
                <a href="/#features" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Capabilities</a>
                <a href="/#workflows" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Workflow Transparency</a>
                <a href="/#briefs" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Creative Briefs</a>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!isConfigured && import.meta.env.DEV && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5" /> Auth Dev Mode
              </span>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {profile?.role !== 'creator' && (
                  <Link to="/dashboard" className={getButtonClassName({ variant: 'outline', size: 'sm' })}>
                    <LayoutDashboard className="w-4 h-4 text-violet-600 mr-1.5" /> Dashboard
                  </Link>
                )}
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-slate-900 leading-none">{profile?.display_name || user.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-1 uppercase tracking-wider">{profile?.role || 'account'}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign Out" className="text-slate-500 hover:text-rose-600">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className={getButtonClassName({ variant: 'ghost', size: 'sm' })}>Sign In</Link>
                <Link to="/auth?mode=signup" className={getButtonClassName({ variant: 'primary', size: 'sm' })}>Get Started</Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6">
          <div className="space-y-1">
            {creatorLinks ? creatorLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            )) : (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Explore Marketplace</Link>
                <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Platform Capabilities</a>
                <a href="/#workflows" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Workflow Transparency</a>
              </>
            )}
          </div>

          {!isConfigured && import.meta.env.DEV && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Auth Dev Mode (Unconfigured)
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-1 pb-2">
                  <p className="text-xs font-semibold text-slate-900">{profile?.display_name || user.email}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{user.email}</p>
                </div>
                {profile?.role !== 'creator' && (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })}>
                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                  </Link>
                )}
                <Button variant="ghost" size="sm" fullWidth onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4 text-rose-600" />} className="text-rose-600">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className={getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })}>Sign In</Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className={getButtonClassName({ variant: 'primary', size: 'sm', fullWidth: true })}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
