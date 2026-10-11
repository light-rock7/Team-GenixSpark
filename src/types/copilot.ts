export type CopilotSurface = 'profile' | 'portfolio';

export interface CopilotHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotProfileContext {
  display_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: string;
  years_experience: number;
  hourly_rate: number | null;
  skills: string[];
  ai_tools: string[];
  specializations: string[];
}

export interface CopilotPortfolioContext {
  title: string;
  description: string | null;
  category: string | null;
  ai_tools: string[];
  skills: string[];
  prompt_summary: string | null;
  workflow_summary: string | null;
  commercial_rights: string | null;
  is_published: boolean;
}

export interface CreatorCopilotContext {
  profile: CopilotProfileContext | null;
  portfolio: CopilotPortfolioContext[];
  profile_completion: number;
  missing_profile_signals: string[];
  claimed_tools_without_portfolio_proof: string[];
}

export interface CreatorCopilotRequest {
  surface: CopilotSurface;
  message: string;
  history: CopilotHistoryMessage[];
  context: CreatorCopilotContext;
}

export interface CreatorCopilotApplyPatch {
  headline?: string;
  bio?: string;
  skills?: string[];
  ai_tools?: string[];
  specializations?: string[];
}

export interface CreatorCopilotResponse {
  answer: string;
  recommendations: string[];
  privacyWarnings: string[];
  apply?: CreatorCopilotApplyPatch;
}
