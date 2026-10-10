import React from 'react';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { getButtonClassName } from '../components/ui/Button';

const getMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return error.status === 404
      ? 'This page could not be found.'
      : error.statusText || `Request failed with status ${error.status}.`;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something interrupted this workspace view.';
};

export const RouteError: React.FC = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-[#f7f8fb] px-4 py-12 sm:px-6">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-[26px] border border-slate-200 bg-white p-7 text-center shadow-[0_20px_55px_rgba(15,23,42,.08)] sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Workspace recovery</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">This view needs another try.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">{getMessage(error)}</p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={() => window.location.reload()} className={getButtonClassName({ variant: 'outline', size: 'md' })}>
              <RefreshCw className="h-4 w-4" /> Reload view
            </button>
            <Link to="/" className={getButtonClassName({ variant: 'primary', size: 'md' })}>
              Back to GenixSpark <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
