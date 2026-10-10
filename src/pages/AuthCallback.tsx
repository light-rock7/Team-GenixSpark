import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LoadingState } from '../components/ui/LoadingState';
import { getButtonClassName } from '../components/ui/Button';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guards against duplicate code exchanges in React 19 / StrictMode
  const exchangeAttemptedRef = useRef<boolean>(false);
  const succeededRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { subscription: { unsubscribe: () => void } } | null = null;

    const scheduleRedirect = (delayMs = 1000) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, delayMs);
    };

    const parseErrorFromUrl = (): string | null => {
      // 1. Check query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const searchErr = searchParams.get('error_description') || searchParams.get('error');
      if (searchErr) {
        return decodeURIComponent(searchErr);
      }

      // 2. Check hash fragment
      if (window.location.hash) {
        const hashStr = window.location.hash.startsWith('#')
          ? window.location.hash.substring(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hashStr);
        const hashErr = hashParams.get('error_description') || hashParams.get('error');
        if (hashErr) {
          return decodeURIComponent(hashErr);
        }
      }

      return null;
    };

    const handleCallback = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Supabase is not configured on this frontend.');
        }
        return;
      }

      // Check query/hash error responses
      const urlError = parseErrorFromUrl();
      if (urlError) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(urlError);
        }
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');

      // PKCE auth code exchange
      if (code) {
        if (!exchangeAttemptedRef.current) {
          exchangeAttemptedRef.current = true;
          try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              if (isMounted && !succeededRef.current) {
                setStatus('error');
                setErrorMessage(error.message);
              }
              return;
            }

            succeededRef.current = true;
            if (isMounted) {
              setStatus('success');
              scheduleRedirect(1000);
            }
          } catch (err: unknown) {
            if (isMounted && !succeededRef.current) {
              setStatus('error');
              setErrorMessage(err instanceof Error ? err.message : 'Failed to complete code exchange.');
            }
          }
        }
        return;
      }

      // Non-PKCE session detection (e.g. hash fragments parsed by supabase client)
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (isMounted && !succeededRef.current) {
            setStatus('error');
            setErrorMessage(error.message);
          }
          return;
        }

        if (session) {
          succeededRef.current = true;
          if (isMounted) {
            setStatus('success');
            scheduleRedirect(800);
          }
          return;
        }

        // Wait briefly for client URL detection if hash is present
        if (window.location.hash.includes('access_token')) {
          const { data: authSub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession && isMounted && !succeededRef.current) {
              succeededRef.current = true;
              setStatus('success');
              if (authSubscription) {
                authSubscription.subscription.unsubscribe();
                authSubscription = null;
              }
              scheduleRedirect(800);
            }
          });
          authSubscription = authSub;

          // Timeout if no session appears
          timerRef.current = window.setTimeout(() => {
            if (authSubscription) {
              authSubscription.subscription.unsubscribe();
              authSubscription = null;
            }
            if (isMounted && !succeededRef.current) {
              setStatus('error');
              setErrorMessage('Session establishment timed out. Please try signing in again.');
            }
          }, 4000);
        } else {
          if (isMounted && !succeededRef.current) {
            setStatus('error');
            setErrorMessage('No authentication credentials found in the callback request.');
          }
        }
      } catch (err: unknown) {
        if (isMounted && !succeededRef.current) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Unexpected authentication error.');
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (authSubscription) {
        authSubscription.subscription.unsubscribe();
        authSubscription = null;
      }
    };
  }, [navigate]);

  if (status === 'verifying') {
    return (
      <LoadingState
        fullPage
        message="Verifying Authentication..."
        description="Completing session handshake. You will be redirected shortly."
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
          <Link
            to="/auth"
            className={getButtonClassName({ variant: 'primary', size: 'md', fullWidth: true })}
          >
            <span className="flex items-center justify-center gap-2">
              Return to Sign In
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link
            to="/"
            className={getButtonClassName({ variant: 'ghost', size: 'md', fullWidth: true })}
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};
