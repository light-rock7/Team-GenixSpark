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

export interface LogoutResult {
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
  logout: () => Promise<LogoutResult>;
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
  const [profileRetryCount, setProfileRetryCount] = useState<number>(0);

  // 1. Initial session restoration and synchronous auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    // Restore current session on mount
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Session retrieval error:', error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    }).catch((err: unknown) => {
      console.error('Failed to restore initial session:', err);
      setLoading(false);
    });

    // Synchronous auth state listener: update session and user state only
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (!newSession?.user || event === 'SIGNED_OUT') {
        setProfile(null);
        setProfileError(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Consolidated profile fetching effect keyed strictly by user ID
  const userId = user?.id;

  useEffect(() => {
    const client = supabase;
    if (!userId || !client) {
      return;
    }

    let isStale = false;

    const loadProfile = async () => {
      // Clear previous profile and set loading before fetching
      setProfile(null);
      setProfileError(null);
      setProfileLoading(true);

      try {
        const { data, error } = await client
          .from('user_profiles')
          .select('id, role, display_name')
          .eq('id', userId)
          .maybeSingle();

        if (isStale) return;

        if (error) {
          setProfile(null);
          setProfileError(`Database query failed: ${error.message} (${error.code || 'schema issue'}).`);
          return;
        }

        if (!data) {
          setProfile(null);
          setProfileError('Profile record not found in user_profiles.');
          return;
        }

        if (data.role !== 'creator' && data.role !== 'brand') {
          setProfile(null);
          setProfileError(`Invalid role "${data.role}" in user_profiles. Expected "creator" or "brand".`);
          return;
        }

        setProfile({
          id: data.id,
          role: data.role as UserRole,
          display_name: data.display_name || 'User',
        });
        setProfileError(null);
      } catch (err: unknown) {
        if (isStale) return;
        const msg = err instanceof Error ? err.message : String(err);
        setProfile(null);
        setProfileError(`Failed to load profile: ${msg}`);
      } finally {
        if (!isStale) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isStale = true;
    };
  }, [userId, profileRetryCount]);

  const refetchProfile = useCallback(async () => {
    setProfileRetryCount((prev) => prev + 1);
  }, []);

  // 3. Login operation with comprehensive returned and thrown error handling
  const login = async (email: string, password: string): Promise<LoginResult> => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Supabase credentials are not configured in environment variables.'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      // Synchronous state update; profile fetch is triggered automatically by userId effect
      setUser(data.user);
      setSession(data.session);

      return { data, error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { data: null, error };
    }
  };

  // 4. Signup operation with comprehensive returned and thrown error handling
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

    try {
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

      const requiresEmailConfirmation = Boolean(data.user && !data.session);

      if (data.session && data.user) {
        setUser(data.user);
        setSession(data.session);
      }

      return { data, error: null, requiresEmailConfirmation };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { data: null, error, requiresEmailConfirmation: false };
    }
  };

  // 5. Explicit sign out handling (reports signOut errors rather than unconditional success)
  const logout = async (): Promise<LogoutResult> => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setProfileError(null);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error };
      }

      setUser(null);
      setSession(null);
      setProfile(null);
      setProfileError(null);
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { error };
    }
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
