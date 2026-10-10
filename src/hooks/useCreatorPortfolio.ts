import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import {
  createPortfolioItem,
  deletePortfolioItem,
  getCreatorPortfolio,
  setPortfolioPublished,
  uploadPortfolioMedia,
} from '../services/creatorService';
import type { PortfolioItem, PortfolioItemCreate } from '../types/creator';

export const useCreatorPortfolio = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creatorId = user?.id;

  const refresh = useCallback(async () => {
    if (!creatorId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setItems(await getCreatorPortfolio(creatorId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load portfolio.');
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (input: PortfolioItemCreate) => {
    if (!creatorId) throw new Error('You must be signed in to add portfolio work.');

    setSaving(true);
    setError(null);
    try {
      const created = await createPortfolioItem(creatorId, input);
      setItems((current) => [created, ...current]);
      return created;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to create portfolio item.';
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [creatorId]);

  const uploadMedia = useCallback(async (file: File) => {
    if (!creatorId) throw new Error('You must be signed in to upload portfolio media.');
    return uploadPortfolioMedia(creatorId, file);
  }, [creatorId]);

  const togglePublished = useCallback(async (itemId: string, published: boolean) => {
    if (!creatorId) return;
    setError(null);
    try {
      await setPortfolioPublished(creatorId, itemId, published);
      setItems((current) => current.map((item) => (
        item.id === itemId ? { ...item, is_published: published } : item
      )));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to update portfolio visibility.';
      setError(message);
      throw new Error(message);
    }
  }, [creatorId]);

  const remove = useCallback(async (itemId: string) => {
    if (!creatorId) return;
    setError(null);
    try {
      await deletePortfolioItem(creatorId, itemId);
      setItems((current) => current.filter((item) => item.id !== itemId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete portfolio item.';
      setError(message);
      throw new Error(message);
    }
  }, [creatorId]);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((item) => item.is_published).length,
    drafts: items.filter((item) => !item.is_published).length,
  }), [items]);

  return {
    items,
    stats,
    loading,
    saving,
    error,
    refresh,
    create,
    uploadMedia,
    togglePublished,
    remove,
  };
};
