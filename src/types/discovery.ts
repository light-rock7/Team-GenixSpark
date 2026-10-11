import type { CreatorAvailability, CreatorProfile } from './creator';

export type DiscoverySort = 'best_fit' | 'experience' | 'newest';

export interface DiscoveryCreator extends CreatorProfile {
  portfolio_count: number;
  content_types: string[];
}

export interface DiscoveryFilters {
  query: string;
  contentTypes: string[];
  aiTools: string[];
  skills: string[];
  specializations: string[];
  availability: CreatorAvailability | 'all';
  minExperience: number | null;
}

export interface DiscoveryMatch {
  score: number | null;
  reasons: string[];
  matchedCriteria: number;
  totalCriteria: number;
}

export interface DiscoveryResult {
  creator: DiscoveryCreator;
  match: DiscoveryMatch;
}

export interface DiscoveryOptions {
  contentTypes: string[];
  aiTools: string[];
  skills: string[];
  specializations: string[];
}
