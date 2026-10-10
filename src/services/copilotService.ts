import { supabase } from '../lib/supabase';
import type { CreatorCopilotRequest, CreatorCopilotResponse } from '../types/copilot';

const normalizeStringArray = (value: unknown): string[] => (
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 8)
    : []
);

const normalizeResponse = (value: unknown): CreatorCopilotResponse => {
  if (!value || typeof value !== 'object') throw new Error('Creator Copilot returned an invalid response.');
  const data = value as Record<string, unknown>;
  if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Creator Copilot returned an empty response.');

  let apply: CreatorCopilotResponse['apply'];
  if (data.apply && typeof data.apply === 'object') {
    const raw = data.apply as Record<string, unknown>;
    apply = {
      ...(typeof raw.headline === 'string' ? { headline: raw.headline.trim().slice(0, 140) } : {}),
      ...(typeof raw.bio === 'string' ? { bio: raw.bio.trim().slice(0, 1200) } : {}),
      ...(raw.skills ? { skills: normalizeStringArray(raw.skills) } : {}),
      ...(raw.ai_tools ? { ai_tools: normalizeStringArray(raw.ai_tools) } : {}),
      ...(raw.specializations ? { specializations: normalizeStringArray(raw.specializations) } : {}),
    };
    if (Object.keys(apply).length === 0) apply = undefined;
  }

  return {
    answer: data.answer.trim(),
    recommendations: normalizeStringArray(data.recommendations),
    privacyWarnings: normalizeStringArray(data.privacyWarnings),
    apply,
  };
};

export const askCreatorCopilot = async (request: CreatorCopilotRequest): Promise<CreatorCopilotResponse> => {
  if (!supabase) throw new Error('Supabase is not configured. Add your project credentials and restart the app.');

  const { data, error } = await supabase.functions.invoke('creator-copilot', {
    body: {
      ...request,
      message: request.message.trim().slice(0, 1200),
      history: request.history.slice(-6).map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1200),
      })),
    },
  });

  if (error) {
    const message = error.message || 'Creator Copilot is unavailable.';
    if (/404|not found|function/i.test(message)) {
      throw new Error('Creator Copilot backend is not deployed yet. Deploy the Supabase Edge Function and configure the AI secret.');
    }
    throw new Error(message);
  }

  if (data?.error && typeof data.error === 'string') throw new Error(data.error);
  return normalizeResponse(data);
};
