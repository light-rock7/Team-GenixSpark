export type CreatorAvailability = 'available' | 'busy' | 'unavailable';
export type PortfolioMediaType = 'image' | 'video' | 'link';

export interface CreatorProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: CreatorAvailability;
  years_experience: number;
  hourly_rate: number | null;
  skills: string[];
  ai_tools: string[];
  specializations: string[];
  website_url: string | null;
  social_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatorProfileUpdate {
  display_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: CreatorAvailability;
  years_experience: number;
  hourly_rate: number | null;
  skills: string[];
  ai_tools: string[];
  specializations: string[];
  website_url: string | null;
  social_url: string | null;
}

export interface PortfolioItem {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  media_url: string;
  thumbnail_url: string | null;
  media_type: PortfolioMediaType;
  category: string | null;
  ai_tools: string[];
  skills: string[];
  prompt_summary: string | null;
  workflow_summary: string | null;
  commercial_rights: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItemCreate {
  title: string;
  description: string | null;
  media_url: string;
  thumbnail_url?: string | null;
  media_type: PortfolioMediaType;
  category: string | null;
  ai_tools: string[];
  skills: string[];
  prompt_summary: string | null;
  workflow_summary: string | null;
  commercial_rights: string | null;
  is_published: boolean;
}

export interface CreatorPublicView {
  profile: CreatorProfile;
  portfolio: PortfolioItem[];
}

export interface ProfileCompletion {
  percent: number;
  completed: number;
  total: number;
  missing: string[];
}
