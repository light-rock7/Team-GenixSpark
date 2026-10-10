import { supabase } from '../lib/supabase';
import type { BriefReadiness, BriefStatus, CreativeBrief, CreativeBriefCreate } from '../types/brief';

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

export const calculateBriefReadiness = (brief: Partial<CreativeBriefCreate>): BriefReadiness => {
  const checks = [
    { label: 'Clear title', done: Boolean(brief.title?.trim()) },
    { label: 'Project description', done: Boolean(brief.description?.trim() && brief.description.trim().length >= 40) },
    { label: 'Category', done: Boolean(brief.category?.trim()) },
    { label: 'Deliverables', done: Boolean(brief.deliverables?.trim()) },
    { label: 'Required AI tools', done: Boolean(brief.required_tools?.length) },
    { label: 'Required skills', done: Boolean(brief.required_skills?.length) },
    { label: 'Budget range', done: brief.budget_min != null && brief.budget_max != null },
    { label: 'Deadline', done: Boolean(brief.deadline) },
    { label: 'Usage rights', done: Boolean(brief.usage_rights?.trim()) },
  ];

  const completed = checks.filter((item) => item.done).length;
  return {
    completed,
    total: checks.length,
    missing: checks.filter((item) => !item.done).map((item) => item.label),
    percent: Math.round((completed / checks.length) * 100),
  };
};

export const getBrandBriefs = async (brandId: string): Promise<CreativeBrief[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('creative_briefs')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Unable to load brand briefs: ${error.message}`);
  return (data || []) as CreativeBrief[];
};

export const getOpenBriefs = async (): Promise<CreativeBrief[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('creative_briefs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Unable to load open briefs: ${error.message}`);
  return (data || []) as CreativeBrief[];
};

export const getCreativeBrief = async (briefId: string): Promise<CreativeBrief> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('creative_briefs')
    .select('*')
    .eq('id', briefId)
    .single();

  if (error) throw new Error(`Unable to load creative brief: ${error.message}`);
  return data as CreativeBrief;
};

export const createCreativeBrief = async (
  brandId: string,
  input: CreativeBriefCreate
): Promise<CreativeBrief> => {
  const client = requireSupabase();

  if (!input.title.trim()) throw new Error('Brief title is required.');
  if (!input.description.trim()) throw new Error('Brief description is required.');
  if (input.budget_min != null && input.budget_max != null && input.budget_max < input.budget_min) {
    throw new Error('Maximum budget must be greater than or equal to minimum budget.');
  }

  const { data, error } = await client
    .from('creative_briefs')
    .insert({
      brand_id: brandId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: normalizeNullable(input.category),
      required_tools: input.required_tools,
      required_skills: input.required_skills,
      deliverables: normalizeNullable(input.deliverables),
      aspect_ratio: normalizeNullable(input.aspect_ratio),
      usage_rights: normalizeNullable(input.usage_rights),
      budget_min: input.budget_min,
      budget_max: input.budget_max,
      currency: input.currency || 'INR',
      deadline: input.deadline || null,
      reference_notes: normalizeNullable(input.reference_notes),
      status: input.status,
    })
    .select('*')
    .single();

  if (error) throw new Error(`Unable to create creative brief: ${error.message}`);
  return data as CreativeBrief;
};

export const updateBriefStatus = async (
  brandId: string,
  briefId: string,
  status: BriefStatus
): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('creative_briefs')
    .update({ status })
    .eq('id', briefId)
    .eq('brand_id', brandId);

  if (error) throw new Error(`Unable to update brief status: ${error.message}`);
};

export const deleteCreativeBrief = async (brandId: string, briefId: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client
    .from('creative_briefs')
    .delete()
    .eq('id', briefId)
    .eq('brand_id', brandId);

  if (error) throw new Error(`Unable to delete creative brief: ${error.message}`);
};
