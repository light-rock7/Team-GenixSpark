import { supabase } from '../lib/supabase';
import type { BriefBuilderResponse, BriefBuilderSuggestion } from '../types/brief';

const cleanString = (value: unknown, maxLength = 1200): string => (
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
);

const cleanNullable = (value: unknown, maxLength = 1200): string | null => {
  const cleaned = cleanString(value, maxLength);
  return cleaned || null;
};

const cleanArray = (value: unknown, maxItems = 8): string[] => (
  Array.isArray(value)
    ? value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index)
      .slice(0, maxItems)
    : []
);

const normalizeSuggestion = (value: unknown): BriefBuilderSuggestion => {
  if (!value || typeof value !== 'object') throw new Error('AI Brief Builder returned an invalid suggestion.');
  const data = value as Record<string, unknown>;

  const title = cleanString(data.title, 140);
  const description = cleanString(data.description, 2400);
  if (!title || !description) throw new Error('AI Brief Builder returned an incomplete suggestion.');

  return {
    title,
    description,
    category: cleanNullable(data.category, 120),
    content_type: cleanNullable(data.content_type, 120),
    style: cleanNullable(data.style, 500),
    required_tools: cleanArray(data.required_tools),
    required_skills: cleanArray(data.required_skills),
    deliverables: cleanNullable(data.deliverables, 1200),
    aspect_ratio: cleanNullable(data.aspect_ratio, 60),
    usage_rights: cleanNullable(data.usage_rights, 500),
    reference_notes: cleanNullable(data.reference_notes, 800),
  };
};

const getFunctionErrorMessage = async (error: unknown) => {
  let message = error instanceof Error && error.message ? error.message : 'AI Brief Builder is unavailable.';
  const context = error && typeof error === 'object' && 'context' in error
    ? (error as { context?: unknown }).context
    : undefined;

  if (context instanceof Response) {
    try {
      const text = await context.clone().text();
      if (text) {
        try {
          const payload = JSON.parse(text) as Record<string, unknown>;
          if (typeof payload.error === 'string' && payload.error.trim()) message = payload.error.trim();
        } catch {
          message = text.slice(0, 300);
        }
      }
    } catch {
      // Keep the original SDK error if the response body cannot be inspected.
    }
  }

  if (/404|not found|function/i.test(message)) {
    return 'AI Brief Builder backend is not deployed yet. Deploy the brand-brief-builder Supabase Edge Function.';
  }

  return message;
};

export const buildBrandBrief = async (roughIdea: string): Promise<BriefBuilderResponse> => {
  if (!supabase) throw new Error('Supabase is not configured. Add your project credentials and restart the app.');

  const idea = roughIdea.trim();
  if (idea.length < 20) throw new Error('Add a little more detail so the AI can structure a useful brief.');

  const { data, error } = await supabase.functions.invoke('brand-brief-builder', {
    body: { rough_idea: idea.slice(0, 3000) },
  });

  if (error) throw new Error(await getFunctionErrorMessage(error));
  if (data?.error && typeof data.error === 'string') throw new Error(data.error);
  if (!data || typeof data !== 'object') throw new Error('AI Brief Builder returned an invalid response.');

  const payload = data as Record<string, unknown>;
  return {
    suggestion: normalizeSuggestion(payload.suggestion),
    assumptions: cleanArray(payload.assumptions, 6),
  };
};
