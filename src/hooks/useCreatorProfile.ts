import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import {
  calculateProfileCompletion,
  getCreatorProfile,
  updateCreatorProfile,
  uploadCreatorAvatar,
} from '../services/creatorService';
import type { CreatorProfile, CreatorProfileUpdate } from '../types/creator';

export const useCreatorProfile = () => {
  const { user, refetchProfile: refetchAuthProfile } = useAuth();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCreatorProfile(userId);
      setProfile(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load creator profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (update: CreatorProfileUpdate) => {
    if (!userId) throw new Error('You must be signed in to update your creator profile.');

    setSaving(true);
    setError(null);
    try {
      const updated = await updateCreatorProfile(userId, update);
      setProfile(updated);
      await refetchAuthProfile();
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to save creator profile.';
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [userId, refetchAuthProfile]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!userId) throw new Error('You must be signed in to upload an avatar.');

    setUploadingAvatar(true);
    setError(null);
    try {
      const avatarUrl = await uploadCreatorAvatar(userId, file);
      setProfile((current) => current ? { ...current, avatar_url: avatarUrl } : current);
      return avatarUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to upload avatar.';
      setError(message);
      throw new Error(message);
    } finally {
      setUploadingAvatar(false);
    }
  }, [userId]);

  const completion = useMemo(() => calculateProfileCompletion(profile), [profile]);

  return {
    profile,
    completion,
    loading,
    saving,
    uploadingAvatar,
    error,
    refresh,
    save,
    uploadAvatar,
  };
};
