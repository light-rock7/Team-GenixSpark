import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'creator' | 'brand';

export interface UserProfile {
  id: string;
  role: UserRole;
  display_name: string;
}

// Safely read Vite environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : '';
const supabasePublishableKey = typeof rawSupabasePublishableKey === 'string' ? rawSupabasePublishableKey.trim() : '';

// Check if credentials are valid and not untouched placeholder strings
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  !supabaseUrl.includes('your-project-id') &&
  !supabasePublishableKey.includes('your-supabase-publishable-key')
);

// Instantiate client only when valid to prevent client crash during initialization
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
