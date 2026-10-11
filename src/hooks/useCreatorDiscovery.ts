import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDiscoveryCreators } from '../services/discoveryService';
import type {
  DiscoveryCreator,
  DiscoveryFilters,
  DiscoveryMatch,
  DiscoveryOptions,
  DiscoveryResult,
  DiscoverySort,
} from '../types/discovery';

export const EMPTY_DISCOVERY_FILTERS: DiscoveryFilters = {
  query: '',
  contentTypes: [],
  aiTools: [],
  skills: [],
  specializations: [],
  availability: 'all',
  minExperience: null,
};

const normalized = (value: string) => value.trim().toLowerCase();

const includesTerm = (creator: DiscoveryCreator, term: string) => {
  const searchable = [
    creator.display_name,
    creator.headline || '',
    creator.bio || '',
    creator.location || '',
    ...creator.content_types,
    ...creator.ai_tools,
    ...creator.skills,
    ...creator.specializations,
  ].join(' ').toLowerCase();

  return searchable.includes(normalized(term));
};

const intersects = (source: string[], selected: string[]) => {
  if (selected.length === 0) return true;
  const sourceSet = new Set(source.map(normalized));
  return selected.some((value) => sourceSet.has(normalized(value)));
};

const calculateMatch = (creator: DiscoveryCreator, filters: DiscoveryFilters): DiscoveryMatch => {
  const criteria: { matched: boolean; reason?: string }[] = [];

  if (filters.query.trim()) {
    criteria.push({ matched: includesTerm(creator, filters.query), reason: 'Search relevance' });
  }

  filters.contentTypes.forEach((contentType) => {
    const matched = creator.content_types.some((item) => normalized(item) === normalized(contentType));
    criteria.push({ matched, reason: matched ? `Content: ${contentType}` : undefined });
  });

  filters.aiTools.forEach((tool) => {
    const matched = creator.ai_tools.some((item) => normalized(item) === normalized(tool));
    criteria.push({ matched, reason: matched ? tool : undefined });
  });

  filters.skills.forEach((skill) => {
    const matched = creator.skills.some((item) => normalized(item) === normalized(skill));
    criteria.push({ matched, reason: matched ? skill : undefined });
  });

  filters.specializations.forEach((specialization) => {
    const matched = creator.specializations.some((item) => normalized(item) === normalized(specialization));
    criteria.push({ matched, reason: matched ? specialization : undefined });
  });

  if (filters.availability !== 'all') {
    const matched = creator.availability === filters.availability;
    criteria.push({ matched, reason: matched ? 'Availability' : undefined });
  }

  if (filters.minExperience != null) {
    const matched = creator.years_experience >= filters.minExperience;
    criteria.push({ matched, reason: matched ? `${filters.minExperience}+ years` : undefined });
  }

  if (criteria.length === 0) {
    return { score: null, reasons: [], matchedCriteria: 0, totalCriteria: 0 };
  }

  const matchedCriteria = criteria.filter((item) => item.matched).length;
  const reasons = criteria
    .filter((item) => item.matched && item.reason)
    .map((item) => item.reason as string)
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 3);

  return {
    score: Math.round((matchedCriteria / criteria.length) * 100),
    reasons,
    matchedCriteria,
    totalCriteria: criteria.length,
  };
};

const passesFilters = (creator: DiscoveryCreator, filters: DiscoveryFilters) => {
  if (filters.query.trim() && !includesTerm(creator, filters.query)) return false;
  if (!intersects(creator.content_types, filters.contentTypes)) return false;
  if (!intersects(creator.ai_tools, filters.aiTools)) return false;
  if (!intersects(creator.skills, filters.skills)) return false;
  if (!intersects(creator.specializations, filters.specializations)) return false;
  if (filters.availability !== 'all' && creator.availability !== filters.availability) return false;
  if (filters.minExperience != null && creator.years_experience < filters.minExperience) return false;
  return true;
};

const recommendationSignal = (creator: DiscoveryCreator) => {
  let score = 0;
  if (creator.availability === 'available') score += 4;
  if (creator.headline) score += 2;
  if (creator.bio) score += 1;
  if (creator.ai_tools.length > 0) score += 2;
  if (creator.specializations.length > 0) score += 1;
  if (creator.content_types.length > 0) score += 1;
  score += Math.min(creator.portfolio_count, 4) * 2;
  return score;
};

const uniqueSorted = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

export const useCreatorDiscovery = (initialFilters?: Partial<DiscoveryFilters>) => {
  const [creators, setCreators] = useState<DiscoveryCreator[]>([]);
  const [filters, setFilters] = useState<DiscoveryFilters>(() => ({
    ...EMPTY_DISCOVERY_FILTERS,
    ...initialFilters,
    contentTypes: initialFilters?.contentTypes || [],
    aiTools: initialFilters?.aiTools || [],
    skills: initialFilters?.skills || [],
    specializations: initialFilters?.specializations || [],
  }));
  const [sort, setSort] = useState<DiscoverySort>('best_fit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCreators(await getDiscoveryCreators());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load creators.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const options = useMemo<DiscoveryOptions>(() => ({
    contentTypes: uniqueSorted(creators.flatMap((creator) => creator.content_types)),
    aiTools: uniqueSorted(creators.flatMap((creator) => creator.ai_tools)),
    skills: uniqueSorted(creators.flatMap((creator) => creator.skills)),
    specializations: uniqueSorted(creators.flatMap((creator) => creator.specializations)),
  }), [creators]);

  const activeFilterCount = useMemo(() => (
    (filters.query.trim() ? 1 : 0)
    + filters.contentTypes.length
    + filters.aiTools.length
    + filters.skills.length
    + filters.specializations.length
    + (filters.availability !== 'all' ? 1 : 0)
    + (filters.minExperience != null ? 1 : 0)
  ), [filters]);

  const results = useMemo<DiscoveryResult[]>(() => {
    const next = creators
      .filter((creator) => passesFilters(creator, filters))
      .map((creator) => ({ creator, match: calculateMatch(creator, filters) }));

    return next.sort((a, b) => {
      if (sort === 'experience') return b.creator.years_experience - a.creator.years_experience;
      if (sort === 'newest') {
        return new Date(b.creator.created_at || 0).getTime() - new Date(a.creator.created_at || 0).getTime();
      }
      if (activeFilterCount > 0 && a.match.score !== b.match.score) {
        return (b.match.score || 0) - (a.match.score || 0);
      }
      return recommendationSignal(b.creator) - recommendationSignal(a.creator);
    });
  }, [creators, filters, sort, activeFilterCount]);

  const resetFilters = useCallback(() => setFilters({ ...EMPTY_DISCOVERY_FILTERS, contentTypes: [], aiTools: [], skills: [], specializations: [] }), []);

  return {
    creators,
    results,
    filters,
    setFilters,
    sort,
    setSort,
    options,
    activeFilterCount,
    loading,
    error,
    refresh,
    resetFilters,
  };
};
