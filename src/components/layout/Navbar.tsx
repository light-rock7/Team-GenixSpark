import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, getButtonClassName } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCreator = Boolean(user && profile?.role === 'creator');

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) console.error('Failed to sign out:', error.message);
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/94 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex h-[68px] items-center justify-between gap-5">
          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="GenixSpark home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition-transform group-hover:-rotate-2 group-hover:scale-[1.03]">
              <Sparkles className="h-[18px] w-[18px] text-violet-300" />
            </div>
            <div className="leading-none">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-[-0.025em] text-slate-950">GenixSpark</span>
                <span className="rounded-full bg-violet-50 px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-violet-700">AI</span>
              </div>
              <p className="mt-1 text-[9px] font-medium tracking-[0.08em] text-slate-400">CREATOR MARKETPLACE</p>
            </div>
          </Link>

          {!isCreator && (
            <nav className="hidden items-center gap-1 md:flex">
              <a href="/#creators" className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950">For creators</a>
              <a href="/#brands" className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950">For brands</a>
              <a href="/#workflow" className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950">Workflow proof</a>
            </nav>
          )}

          <div className="hidden shrink-0 items-center gap-2.5 md:flex">
            {!isConfigured && import.meta.env.DEV && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-700">
                <ShieldAlert className="h-3.5 w-3.5" /> Dev auth
              </span>
            )}

            {user ? (
              <>
                {profile?.role !== 'creator' && (
                  <Link to="/dashboard" className={getButtonClassName({ variant: 'outline', size: 'sm' })}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <div className="ml-1 hidden border-l border-slate-200 pl-4 lg:block">
                  <p className="max-w-[140px] truncate text-xs font-semibold text-slate-900">{profile?.display_name || user.email?.split('@')[0]}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">{profile?.role || 'account'}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Sign out" className="px-2.5 text-slate-400 hover:text-rose-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className={getButtonClassName({ variant: 'ghost', size: 'sm' })}>Sign in</Link>
                <Link to="/auth?mode=signup" className={getButtonClassName({ variant: 'primary', size: 'sm' })}>Join GenixSpark</Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          {!isCreator && (
            <div className="space-y-1">
              <a href="/#creators" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">For creators</a>
              <a href="/#brands" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">For brands</a>
              <a href="/#workflow" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Workflow proof</a>
            </div>
          )}

          <div className={`${!isCreator ? 'mt-4 border-t border-slate-100 pt-4' : ''}`}>
            {user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.display_name || user.email}</p>
                  <p className="mt-1 text-xs text-slate-400">{user.email}</p>
                </div>
                <Button variant="ghost" size="sm" fullWidth onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />} className="justify-start text-rose-600">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/auth?mode=login" className={getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })}>Sign in</Link>
                <Link to="/auth?mode=signup" className={getButtonClassName({ variant: 'primary', size: 'sm', fullWidth: true })}>Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};