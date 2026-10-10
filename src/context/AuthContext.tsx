import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type UserProfile, type UserRole } from '../lib/supabase';

export interface SignupResult {
  data: { user: User | null; session: Session | null } | null;
  error: AuthError | Error | null;
  requiresEmailConfirmation: boolean;
}

export interface LoginResult {
  data: { user: User; session: Session } | null;
  error: AuthError | Error | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (email: string, password: string, displayName: string, role: UserRole) => Promise<SignupResult>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch persisted role from public.user_profiles
  const fetchProfile = useCallback(async (userId: string): Promise<{ profile: UserProfile | null; error: string | null }> => {
    if (!supabase) {
      return { profile: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, role, display_name')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return {
          profile: null,
          error: `Database error querying user_profiles: ${error.message} (${error.code || 'schema issue'}). Member 4 database setup may be required.`,
        };
      }

      if (!data) {
        return {
          profile: null,
          error: 'Profile record not found in user_profiles. The backend profile provisioning flow by Member 4 has not executed for this account yet.',
        };
      }

      if (data.role !== 'creator' && data.role !== 'brand') {
        return {
          profile: null,
          error: `Invalid role "${data.role}" received from user_profiles. Expected "creator" or "brand".`,
        };
      }

      return {
        profile: {
          id: data.id,
          role: data.role as UserRole,
          display_name: data.display_name || 'User',
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        profile: null,
        error: `Failed to query user profile: ${msg}`,
      };
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    if (!user) return;
    setProfileLoading(true);
    const result = await fetchProfile(user.id);
    setProfile(result.profile);
    setProfileError(result.error);
    setProfileLoading(false);
  }, [user, fetchProfile]);

  // Initial session restoration and listener setup
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let isMounted = true;

    // 1. Restore current session
    supabase.auth.getSession().then(async ({ data: { session: currentSession }, error }) => {
      if (!isMounted) return;

      if (error) {
        console.error('Session retrieval error:', error.message);
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        setProfileLoading(true);
        const res = await fetchProfile(currentSession.user.id);
        if (isMounted) {
          setProfile(res.profile);
          setProfileError(res.error);
          setProfileLoading(false);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    // 2. Subscribe to auth state updates
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setProfile(null);
        setProfileError(null);
        setLoading(false);
      } else if (newSession?.user) {
        setProfileLoading(true);
        const res = await fetchProfile(newSession.user.id);
        if (isMounted) {
          setProfile(res.profile);
          setProfileError(res.error);
          setProfileLoading(false);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Supabase credentials are not configured in environment variables.'),
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error };
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      setProfileLoading(true);
      const res = await fetchProfile(data.user.id);
      setProfile(res.profile);
      setProfileError(res.error);
      setProfileLoading(false);
    }

    return { data, error: null };
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ): Promise<SignupResult> => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Supabase credentials are not configured in environment variables.'),
        requiresEmailConfirmation: false,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { data: null, error, requiresEmailConfirmation: false };
    }

    // If confirmation is required, Supabase returns a user but no active session
    const requiresEmailConfirmation = Boolean(data.user && !data.session);

    if (data.session && data.user) {
      setUser(data.user);
      setSession(data.session);
      setProfileLoading(true);
      const res = await fetchProfile(data.user.id);
      setProfile(res.profile);
      setProfileError(res.error);
      setProfileLoading(false);
    }

    return { data, error: null, requiresEmailConfirmation };
  };

  const logout = async (): Promise<void> => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        profileLoading,
        profileError,
        isConfigured: isSupabaseConfigured,
        login,
        signup,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
