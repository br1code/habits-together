import {
  fetchExperienceLogs,
  fetchUserProfile,
  fetchFriendProfiles,
} from '@/api';
import { ExperienceLog, UserProfile } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface UseFetchUserProfileResult {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// TODO: use SWR package
export const useFetchUserProfile = (
  userId?: string
): UseFetchUserProfileResult => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedUserProfile = await fetchUserProfile(userId);
      setUserProfile(fetchedUserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile.');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAndSetUserProfile();
  }, [fetchAndSetUserProfile]);

  return { userProfile, loading, error, refresh: fetchAndSetUserProfile };
};

interface UseFetchExperienceLogsResult {
  experienceLogs: ExperienceLog[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

interface FetchExperienceLogsParams {
  pageSize?: number;
}

// TODO: use SWR package
export const useFetchExperienceLogs = (
  initialParams: FetchExperienceLogsParams = {}
): UseFetchExperienceLogsResult => {
  const { pageSize = 5 } = initialParams;

  const [experienceLogs, setExperienceLogs] = useState<ExperienceLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the initial page
    const fetchInitialExperienceLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedExperienceLogs = await fetchExperienceLogs({
          pageNumber: 1,
          pageSize,
        });

        setExperienceLogs(fetchedExperienceLogs);

        if (fetchedExperienceLogs.length < pageSize) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching experience logs:', error);
        setError('Failed to load experience logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialExperienceLogs();
  }, [pageSize]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = currentPage + 1;
      const fetchedExperienceLogs = await fetchExperienceLogs({
        pageNumber: nextPage,
        pageSize,
      });

      setExperienceLogs((prevExperienceLogs) => [
        ...prevExperienceLogs,
        ...fetchedExperienceLogs,
      ]);

      if (fetchedExperienceLogs.length < pageSize) {
        setHasMore(false);
      }

      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error fetching experience logs:', error);
      setError('Failed to load more experience logs.');
    } finally {
      setLoading(false);
    }
  };

  return { experienceLogs, loading, error, hasMore, loadMore };
};

interface UseFetchFriendProfilesResult {
  friendProfiles: UserProfile[] | null;
  loading: boolean;
  error: string | null;
}

// TODO: use SWR package
export const useFetchFriendProfiles = (): UseFetchFriendProfilesResult => {
  const [friendProfiles, setFriendProfiles] = useState<UserProfile[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetFriendProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedFriendProfiles = await fetchFriendProfiles();
        setFriendProfiles(fetchedFriendProfiles);
      } catch (error) {
        console.error('Error fetching friend profiles:', error);
        setError('Failed to load friend profiles.');
        setFriendProfiles(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetFriendProfiles();
  }, []);

  return { friendProfiles, loading, error };
};
