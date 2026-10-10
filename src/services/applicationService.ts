import { supabase } from '../lib/supabase';
import type {
  Application,
  ApplicationCreate,
  ApplicationStatus,
  BrandApplicationRow,
  CreatorApplicationRow,
} from '../types/application';
import type { CreativeBrief } from '../types/brief';

const requireSupabase = () => {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
};

export const createApplication = async (input: ApplicationCreate): Promise<Application> => {
  const client = requireSupabase();
  if (!input.message.trim()) throw new Error('Add a short note explaining why you fit this brief.');

  const { data, error } = await client
    .from('applications')
    .insert({
      brief_id: input.brief_id,
      creator_id: input.creator_id,
      message: input.message.trim(),
      proposed_price: input.proposed_price,
      currency: input.currency || 'INR',
      expected_delivery_days: input.expected_delivery_days,
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('You already applied to this brief.');
    throw new Error(`Unable to submit application: ${error.message}`);
  }
  return data as Application;
};

export const getCreatorApplicationForBrief = async (
  briefId: string,
  creatorId: string
): Promise<Application | null> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('brief_id', briefId)
    .eq('creator_id', creatorId)
    .maybeSingle();

  if (error) throw new Error(`Unable to load application: ${error.message}`);
  return (data as Application | null) || null;
};

export const getBrandApplications = async (briefId: string): Promise<BrandApplicationRow[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('brief_id', briefId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Unable to load applicants: ${error.message}`);
  const applications = (data || []) as Application[];
  if (!applications.length) return [];

  const creatorIds = [...new Set(applications.map((item) => item.creator_id))];
  const [{ data: creatorProfiles, error: creatorError }, { data: userProfiles, error: userError }] = await Promise.all([
    client
      .from('creator_profiles')
      .select('user_id, headline, avatar_url, ai_tools, skills, years_experience, hourly_rate')
      .in('user_id', creatorIds),
    client
      .from('user_profiles')
      .select('id, display_name')
      .in('id', creatorIds),
  ]);

  if (creatorError) throw new Error(`Unable to load creator profiles: ${creatorError.message}`);
  if (userError) throw new Error(`Unable to load creator identities: ${userError.message}`);

  const creatorMap = new Map((creatorProfiles || []).map((item) => [item.user_id, item]));
  const userMap = new Map((userProfiles || []).map((item) => [item.id, item]));

  return applications.map((application) => {
    const creator = creatorMap.get(application.creator_id);
    const user = userMap.get(application.creator_id);
    return {
      ...application,
      creator: creator ? {
        display_name: user?.display_name || 'Creator',
        headline: creator.headline || null,
        avatar_url: creator.avatar_url || null,
        ai_tools: Array.isArray(creator.ai_tools) ? creator.ai_tools : [],
        skills: Array.isArray(creator.skills) ? creator.skills : [],
        years_experience: creator.years_experience ?? null,
        hourly_rate: creator.hourly_rate ?? null,
      } : null,
    };
  });
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) throw new Error(`Unable to update application: ${error.message}`);
};

export const awardApplication = async (
  brandId: string,
  briefId: string,
  applicationId: string
): Promise<void> => {
  const client = requireSupabase();

  const { error: acceptError } = await client
    .from('applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId)
    .eq('brief_id', briefId);
  if (acceptError) throw new Error(`Unable to accept creator: ${acceptError.message}`);

  const { error: rejectError } = await client
    .from('applications')
    .update({ status: 'rejected' })
    .eq('brief_id', briefId)
    .neq('id', applicationId)
    .in('status', ['pending', 'shortlisted']);
  if (rejectError) throw new Error(`Creator accepted, but other applications could not be closed: ${rejectError.message}`);

  const { error: briefError } = await client
    .from('creative_briefs')
    .update({ status: 'awarded' })
    .eq('id', briefId)
    .eq('brand_id', brandId);
  if (briefError) throw new Error(`Creator accepted, but brief could not be marked awarded: ${briefError.message}`);
};

export const getCreatorApplications = async (creatorId: string): Promise<CreatorApplicationRow[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Unable to load your applications: ${error.message}`);
  const applications = (data || []) as Application[];
  if (!applications.length) return [];

  const briefIds = [...new Set(applications.map((item) => item.brief_id))];
  const { data: briefs, error: briefError } = await client
    .from('creative_briefs')
    .select('*')
    .in('id', briefIds);
  if (briefError) throw new Error(`Unable to load applied briefs: ${briefError.message}`);

  const briefMap = new Map(((briefs || []) as CreativeBrief[]).map((brief) => [brief.id, brief]));
  return applications.map((application) => ({ ...application, brief: briefMap.get(application.brief_id) || null }));
};
