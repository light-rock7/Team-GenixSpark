import type { CreativeBrief } from './brief';

export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  brief_id: string;
  creator_id: string;
  message: string | null;
  proposed_price: number | null;
  currency: string;
  expected_delivery_days: number | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  brief_id: string;
  creator_id: string;
  message: string;
  proposed_price: number | null;
  currency: string;
  expected_delivery_days: number | null;
}

export interface CreatorApplicationRow extends Application {
  brief: CreativeBrief | null;
}

export interface BrandApplicationRow extends Application {
  creator: {
    display_name: string;
    headline: string | null;
    avatar_url: string | null;
    ai_tools: string[];
    skills: string[];
    years_experience: number | null;
    hourly_rate: number | null;
  } | null;
}
