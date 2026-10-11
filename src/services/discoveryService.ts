import { supabase } from '../lib/supabase';
import type { DiscoveryCreator } from '../types/discovery';

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  return supabase;
};

type IdentityRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at?: string;
};

type CreatorRow = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: DiscoveryCreator['availability'];
  years_experience: number | null;
  hourly_rate: number | null;
  skills: string[] | null;
  ai_tools: string[] | null;
  specializations: string[] | null;
  website_url: string | null;
  social_url: string | null;
  created_at?: string;
  updated_at?: string;
};

type PortfolioSignalRow = {
  creator_id: string;
  category: string | null;
};

export const getDiscoveryCreators = async (): Promise<DiscoveryCreator[]> => {
  const client = requireSupabase();

  const [identityResult, creatorResult, portfolioResult] = await Promise.all([
    client
      .from('user_profiles')
      .select('id, display_name, avatar_url, created_at')
      .eq('role', 'creator'),
    client
      .from('creator_profiles')
      .select('*'),
    client
      .from('portfolio_items')
      .select('creator_id, category')
      .eq('is_published', true),
  ]);

  if (identityResult.error) {
    throw new Error(`Unable to load creator identities: ${identityResult.error.message}`);
  }
  if (creatorResult.error) {
    throw new Error(`Unable to load creator profiles: ${creatorResult.error.message}`);
  }
  if (portfolioResult.error) {
    throw new Error(`Unable to load creator portfolio signals: ${portfolioResult.error.message}`);
  }

  const identities = (identityResult.data || []) as IdentityRow[];
  const creators = (creatorResult.data || []) as CreatorRow[];
  const portfolioRows = (portfolioResult.data || []) as PortfolioSignalRow[];

  const identityById = new Map(identities.map((item) => [item.id, item]));
  const portfolioCountByCreator = new Map<string, number>();
  const contentTypesByCreator = new Map<string, Set<string>>();

  portfolioRows.forEach(({ creator_id, category }) => {
    portfolioCountByCreator.set(creator_id, (portfolioCountByCreator.get(creator_id) || 0) + 1);
    const normalizedCategory = category?.trim();
    if (normalizedCategory) {
      const contentTypes = contentTypesByCreator.get(creator_id) || new Set<string>();
      contentTypes.add(normalizedCategory);
      contentTypesByCreator.set(creator_id, contentTypes);
    }
  });

  return creators
    .map((creator): DiscoveryCreator | null => {
      const identity = identityById.get(creator.user_id);
      if (!identity) return null;

      return {
        user_id: creator.user_id,
        display_name: identity.display_name,
        avatar_url: identity.avatar_url,
        headline: creator.headline,
        bio: creator.bio,
        location: creator.location,
        availability: creator.availability || 'available',
        years_experience: Number(creator.years_experience || 0),
        hourly_rate: creator.hourly_rate == null ? null : Number(creator.hourly_rate),
        skills: creator.skills || [],
        ai_tools: creator.ai_tools || [],
        specializations: creator.specializations || [],
        website_url: creator.website_url,
        social_url: creator.social_url,
        created_at: creator.created_at || identity.created_at,
        updated_at: creator.updated_at,
        portfolio_count: portfolioCountByCreator.get(creator.user_id) || 0,
        content_types: Array.from(contentTypesByCreator.get(creator.user_id) || []).sort((a, b) => a.localeCompare(b)),
      };
    })
    .filter((creator): creator is DiscoveryCreator => creator !== null);
};
