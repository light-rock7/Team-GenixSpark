import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, LayoutDashboard, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, getButtonClassName } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error('Failed to sign out:', error.message);
    }
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-violet-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-violet-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  GenixSpark
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                  Creator Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Explore
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Platform Capabilities
            </a>
            <a
              href="#workflows"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Workflow Transparency
            </a>
            <a
              href="#briefs"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Creative Briefs
            </a>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isConfigured && import.meta.env.DEV && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                Auth Dev Mode
              </span>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className={getButtonClassName({ variant: 'outline', size: 'sm' })}
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-600 mr-1.5" />
                  <span>Dashboard</span>
                  {profile?.role && (
                    <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-100 text-violet-800">
                      {profile.role}
                    </span>
                  )}
                </Link>

                <div className="h-6 w-px bg-slate-200" />

                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-900 leading-none">
                    {profile?.display_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none mt-1">
                    {user.email}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="text-slate-500 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className={getButtonClassName({ variant: 'ghost', size: 'sm' })}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className={getButtonClassName({ variant: 'primary', size: 'sm' })}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-violet-600"
          >
            Explore Marketplace
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-violet-600"
          >
            Platform Capabilities
          </a>
          <a
            href="#workflows"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-violet-600"
          >
            Workflow Transparency
          </a>

          {!isConfigured && import.meta.env.DEV && (
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Auth Dev Mode (Unconfigured)</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="py-1">
                  <p className="text-xs font-semibold text-slate-900">
                    {profile?.display_name || user.email}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Role: <span className="font-bold text-violet-600 uppercase">{profile?.role || 'Pending'}</span>
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Go to Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4 text-rose-600" />}
                  className="text-rose-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className={getButtonClassName({ variant: 'outline', size: 'sm', fullWidth: true })}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={getButtonClassName({ variant: 'primary', size: 'sm', fullWidth: true })}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
