import { supabase } from '../lib/supabase';
import type {
  CreatorProfile,
  CreatorProfileUpdate,
  CreatorPublicView,
  PortfolioItem,
  PortfolioItemCreate,
  ProfileCompletion,
} from '../types/creator';

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  return supabase;
};

const normalizeNullable = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const calculateProfileCompletion = (profile: CreatorProfile | null): ProfileCompletion => {
  if (!profile) {
    return { percent: 0, completed: 0, total: 9, missing: ['Profile details'] };
  }

  const checks = [
    { label: 'Profile photo', done: Boolean(profile.avatar_url) },
    { label: 'Professional headline', done: Boolean(profile.headline?.trim()) },
    { label: 'Creator bio', done: Boolean(profile.bio?.trim()) },
    { label: 'Location', done: Boolean(profile.location?.trim()) },
    { label: 'AI tools', done: profile.ai_tools.length > 0 },
    { label: 'Skills', done: profile.skills.length > 0 },
    { label: 'Specializations', done: profile.specializations.length > 0 },
    { label: 'Experience', done: profile.years_experience > 0 },
    { label: 'Portfolio or website link', done: Boolean(profile.website_url?.trim() || profile.social_url?.trim()) },
  ];

  const completed = checks.filter((item) => item.done).length;
  const missing = checks.filter((item) => !item.done).map((item) => item.label);

  return {
    completed,
    total: checks.length,
    missing,
    percent: Math.round((completed / checks.length) * 100),
  };
};

export const getCreatorProfile = async (userId: string): Promise<CreatorProfile> => {
  const client = requireSupabase();

  const [userProfileResult, creatorProfileResult] = await Promise.all([
    client
      .from('user_profiles')
      .select('id, display_name, avatar_url')
      .eq('id', userId)
      .single(),
    client
      .from('creator_profiles')
      .select('*')
      .eq('user_id', userId)
      .single(),
  ]);

  if (userProfileResult.error) {
    throw new Error(`Unable to load creator identity: ${userProfileResult.error.message}`);
  }
  if (creatorProfileResult.error) {
    throw new Error(`Unable to load creator profile: ${creatorProfileResult.error.message}`);
  }

  const identity = userProfileResult.data;
  const creator = creatorProfileResult.data;

  return {
    user_id: creator.user_id,
    display_name: identity.display_name,
    avatar_url: identity.avatar_url,
    headline: creator.headline,
    bio: creator.bio,
    location: creator.location,
    availability: creator.availability,
    years_experience: Number(creator.years_experience || 0),
    hourly_rate: creator.hourly_rate == null ? null : Number(creator.hourly_rate),
    skills: creator.skills || [],
    ai_tools: creator.ai_tools || [],
    specializations: creator.specializations || [],
    website_url: creator.website_url,
    social_url: creator.social_url,
    created_at: creator.created_at,
    updated_at: creator.updated_at,
  };
};

export const updateCreatorProfile = async (
  userId: string,
  update: CreatorProfileUpdate
): Promise<CreatorProfile> => {
  const client = requireSupabase();

  const { error: identityError } = await client
    .from('user_profiles')
    .update({ display_name: update.display_name.trim() })
    .eq('id', userId);

  if (identityError) {
    throw new Error(`Unable to update display name: ${identityError.message}`);
  }

  const { error: profileError } = await client
    .from('creator_profiles')
    .update({
      headline: normalizeNullable(update.headline),
      bio: normalizeNullable(update.bio),
      location: normalizeNullable(update.location),
      availability: update.availability,
      years_experience: Math.max(0, Math.min(80, Number(update.years_experience) || 0)),
      hourly_rate: update.hourly_rate == null ? null : Math.max(0, Number(update.hourly_rate)),
      skills: update.skills,
      ai_tools: update.ai_tools,
      specializations: update.specializations,
      website_url: normalizeNullable(update.website_url),
      social_url: normalizeNullable(update.social_url),
    })
    .eq('user_id', userId);

  if (profileError) {
    throw new Error(`Unable to update creator profile: ${profileError.message}`);
  }

  return getCreatorProfile(userId);
};

export const uploadCreatorAvatar = async (userId: string, file: File): Promise<string> => {
  const client = requireSupabase();

  if (!file.type.startsWith('image/')) {
    throw new Error('Avatar must be an image file.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Avatar must be smaller than 5 MB.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'webp';
  const objectPath = `${userId}/avatar.${safeExtension}`;

  const { error: uploadError } = await client.storage
    .from('avatars')
    .upload(objectPath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new Error(`Avatar upload failed: ${uploadError.message}`);
  }

  const { data } = client.storage.from('avatars').getPublicUrl(objectPath);
  const publicUrl = data.publicUrl;

  const { error: profileError } = await client
    .from('user_profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (profileError) {
    throw new Error(`Avatar saved but profile update failed: ${profileError.message}`);
  }

  return `${publicUrl}?v=${Date.now()}`;
};

export const getCreatorPortfolio = async (creatorId: string): Promise<PortfolioItem[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('portfolio_items')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Unable to load portfolio: ${error.message}`);
  }

  return (data || []) as PortfolioItem[];
};

export const uploadPortfolioMedia = async (
  creatorId: string,
  file: File
): Promise<{ url: string; mediaType: 'image' | 'video' }> => {
  const client = requireSupabase();
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    throw new Error('Portfolio media must be an image or video.');
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('Portfolio media must be smaller than 25 MB.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'webp');
  const objectId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const objectPath = `${creatorId}/${objectId}.${extension}`;

  const { error } = await client.storage
    .from('portfolio')
    .upload(objectPath, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Portfolio upload failed: ${error.message}`);
  }

  const { data } = client.storage.from('portfolio').getPublicUrl(objectPath);
  return {
    url: data.publicUrl,
    mediaType: isVideo ? 'video' : 'image',
  };
};

export const createPortfolioItem = async (
  creatorId: string,
  input: PortfolioItemCreate
): Promise<PortfolioItem> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('portfolio_items')
    .insert({
      creator_id: creatorId,
      title: input.title.trim(),
      description: normalizeNullable(input.description),
      media_url: input.media_url,
      thumbnail_url: normalizeNullable(input.thumbnail_url),
      media_type: input.media_type,
      category: normalizeNullable(input.category),
      content_type: normalizeNullable(input.content_type),
      ai_tools: input.ai_tools,
      skills: input.skills,
      prompt_summary: normalizeNullable(input.prompt_summary),
      workflow_summary: normalizeNullable(input.workflow_summary),
      commercial_rights: normalizeNullable(input.commercial_rights),
      is_published: input.is_published,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Unable to create portfolio item: ${error.message}`);
  }

  return data as PortfolioItem;
};

export const setPortfolioPublished = async (
  creatorId: string,
  itemId: string,
  isPublished: boolean
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('portfolio_items')
    .update({ is_published: isPublished })
    .eq('id', itemId)
    .eq('creator_id', creatorId);

  if (error) {
    throw new Error(`Unable to update portfolio visibility: ${error.message}`);
  }
};

export const deletePortfolioItem = async (creatorId: string, itemId: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('portfolio_items')
    .delete()
    .eq('id', itemId)
    .eq('creator_id', creatorId);

  if (error) {
    throw new Error(`Unable to delete portfolio item: ${error.message}`);
  }
};

export const getPublicCreatorView = async (creatorId: string): Promise<CreatorPublicView> => {
  const [profile, portfolio] = await Promise.all([
    getCreatorProfile(creatorId),
    getCreatorPortfolio(creatorId),
  ]);

  return {
    profile,
    portfolio: portfolio.filter((item) => item.is_published),
  };
};
