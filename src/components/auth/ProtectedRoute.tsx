import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Database, RefreshCw, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../lib/supabase';
import { LoadingState } from '../ui/LoadingState';
import { Button } from '../ui/Button';
import { DashboardCreator } from '../../pages/DashboardCreator';
import { DashboardBrand } from '../../pages/DashboardBrand';

export const DashboardEntry: React.FC = () => {
  const { profile } = useAuth();
  if (profile?.role === 'brand') {
    return <DashboardBrand />;
  }
  return <DashboardCreator />;
};

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const location = useLocation();
  const { user, session, profile, loading, profileLoading, profileError, refetchProfile, logout } = useAuth();

  // 1. Initial session restoration
  if (loading) {
    return (
      <LoadingState
        fullPage
        message="Restoring session..."
        description="Verifying authentication tokens with Supabase"
      />
    );
  }

  // 2. Unauthenticated user
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Profile query in progress
  if (profileLoading) {
    return (
      <LoadingState
        fullPage
        message="Loading user profile..."
        description="Querying public.user_profiles for account role and authorization"
      />
    );
  }

  // 4. Missing profile or unavailable database schema
  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
            <Database className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Database Profile Pending
          </h2>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Authenticated as <span className="font-semibold text-slate-800">{user.email}</span>, but the associated profile could not be loaded from <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">public.user_profiles</code>.
          </p>

          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Contract Requirement (Member 4):</span>
            </div>
            <div className="text-slate-600 pl-5">
              • Table: <span className="text-violet-600">public.user_profiles</span><br />
              • Columns: <span className="text-violet-600">id</span> (UUID, PK), <span className="text-violet-600">role</span> (&apos;creator&apos; | &apos;brand&apos;), <span className="text-violet-600">display_name</span> (TEXT)
            </div>
            {profileError && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-rose-600">
                Detail: {profileError}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => refetchProfile()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Profile Check
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => logout()}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Role mismatch guard if specific role is mandated
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
