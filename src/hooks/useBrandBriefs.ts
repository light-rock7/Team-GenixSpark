import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { createCreativeBrief, deleteCreativeBrief, getBrandBriefs, updateBriefStatus } from '../services/briefService';
import type { BriefStatus, CreativeBrief, CreativeBriefCreate } from '../types/brief';

export const useBrandBriefs = () => {
  const { user } = useAuth();
  const brandId = user?.id;
  const [briefs, setBriefs] = useState<CreativeBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!brandId) {
      setBriefs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setBriefs(await getBrandBriefs(brandId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load creative briefs.');
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreativeBriefCreate) => {
    if (!brandId) throw new Error('You must be signed in as a brand to create a brief.');
    setSaving(true);
    setError(null);
    try {
      const created = await createCreativeBrief(brandId, input);
      setBriefs((current) => [created, ...current]);
      return created;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to create creative brief.';
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [brandId]);

  const setStatus = useCallback(async (briefId: string, status: BriefStatus) => {
    if (!brandId) return;
    setError(null);
    try {
      await updateBriefStatus(brandId, briefId, status);
      setBriefs((current) => current.map((brief) => brief.id === briefId ? { ...brief, status } : brief));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update brief status.';
      setError(message);
      throw new Error(message);
    }
  }, [brandId]);

  const remove = useCallback(async (briefId: string) => {
    if (!brandId) return;
    setError(null);
    try {
      await deleteCreativeBrief(brandId, briefId);
      setBriefs((current) => current.filter((brief) => brief.id !== briefId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete creative brief.';
      setError(message);
      throw new Error(message);
    }
  }, [brandId]);

  const stats = useMemo(() => ({
    total: briefs.length,
    open: briefs.filter((brief) => brief.status === 'open').length,
    drafts: briefs.filter((brief) => brief.status === 'draft').length,
    closed: briefs.filter((brief) => brief.status === 'closed' || brief.status === 'awarded').length,
  }), [briefs]);

  return { briefs, stats, loading, saving, error, refresh, create, setStatus, remove };
};
