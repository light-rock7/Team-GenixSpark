import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      // 1. Check configuration
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Supabase is not configured on this frontend.');
        }
        return;
      }

      // 2. Check for explicit error query parameters from Supabase
      const urlError = searchParams.get('error_description') || searchParams.get('error');
      if (urlError) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(decodeURIComponent(urlError));
        }
        return;
      }

      // 3. Check for PKCE auth code
      const code = searchParams.get('code');
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (isMounted) {
              setStatus('error');
              setErrorMessage(error.message);
            }
            return;
          }
        } catch (err: unknown) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Failed to exchange authentication code.');
          }
          return;
        }
      }

      // 4. Verify that session is active
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (isMounted) {
            setStatus('error');
            setErrorMessage(error.message);
          }
          return;
        }

        if (session) {
          if (isMounted) {
            setStatus('success');
            // Brief success state before navigating to dashboard
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1200);
          }
        } else {
          // Check hash parameters if implicit flow was used
          if (window.location.hash.includes('access_token')) {
            // Supabase client auto-parses hashes; give it a brief moment
            setTimeout(async () => {
              if (!supabase) return;
              const { data: { session: hashSession } } = await supabase.auth.getSession();
              if (hashSession && isMounted) {
                setStatus('success');
                setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
              } else if (isMounted) {
                setStatus('error');
                setErrorMessage('Unable to establish an authenticated session from token.');
              }
            }, 600);
          } else {
            if (isMounted) {
              setStatus('error');
              setErrorMessage('No authentication credentials found in the callback request.');
            }
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Unexpected authentication error.');
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams]);

  if (status === 'verifying') {
    return (
      <LoadingState
        fullPage
        message="Verifying Authentication..."
        description="Completing session handshake with Supabase. You will be redirected shortly."
      />
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Authentication Successful
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your identity has been verified. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Authentication Failed
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {errorMessage || 'An error occurred while confirming your credentials.'}
        </p>
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
          <Link to="/auth">
            <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
              Return to Sign In
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" fullWidth>
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
