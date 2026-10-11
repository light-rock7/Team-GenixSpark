
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../lib/supabase';
import { LoadingState } from '../ui/LoadingState';
import { DashboardCreator } from '../../pages/DashboardCreator';
import { DashboardBrand } from '../../pages/DashboardBrand';

// Demo access is available only in local development when Supabase
// is not configured. It must never be enabled in production.
const demoMode = import.meta.env.DEV;

export const DashboardEntry: React.FC = () => {
  const { profile } = useAuth();

  if (demoMode && !profile) {
    return <DashboardBrand />;
  }

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
  const {
    user,
    session,
    profile,
    loading,
    profileLoading,
    profileError,
  } = useAuth();

  // Local development demo: bypass auth only when Supabase is unconfigured.
  if (demoMode && !import.meta.env.VITE_SUPABASE_URL) {
    if (allowedRole === 'creator') {
      return <DashboardCreator />;
    }

    if (allowedRole === 'brand') {
      return <DashboardBrand />;
    }

    return <>{children}</>;
  }

  if (loading) {
    return (
      <LoadingState
        fullPage
        message="Restoring session..."
        description="Verifying authentication tokens"
      />
    );
  }

  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (profileLoading) {
    return (
      <LoadingState
        fullPage
        message="Loading user profile..."
        description="Querying user profile role and permissions"
      />
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Account Profile Pending
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your account is authenticated, but its profile could not be loaded.
          </p>
          {import.meta.env.DEV && (
            <p className="mt-4 break-words text-xs text-rose-600">
              {profileError}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
