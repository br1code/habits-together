import { fetchUserProfile } from '@/api';
import { UserProfile } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface UseFetchUserProfileResult {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// TODO: use SWR package
export const useFetchUserProfile = (): UseFetchUserProfileResult => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedUserProfile = await fetchUserProfile();
      setUserProfile(fetchedUserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile.');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetUserProfile();
  }, [fetchAndSetUserProfile]);

  return { userProfile, loading, error, refresh: fetchAndSetUserProfile };
};
