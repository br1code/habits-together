import { fetchHabitLogs } from '@/api';
import { HabitLog } from '@/types';
import { useEffect, useState } from 'react';

interface UseFetchHabitLogsResult {
  habitLogs: HabitLog[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

interface FetchHabitLogsParams {
  habitId?: string | null;
  pageSize?: number;
}

// TODO: use SWR package
export const useFetchHabitLogs = (
  initialParams: FetchHabitLogsParams = {}
): UseFetchHabitLogsResult => {
  const { habitId = null, pageSize = 5 } = initialParams;

  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the initial page
    const fetchInitialHabitLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedHabitLogs = await fetchHabitLogs({
          habitId,
          pageNumber: 1,
          pageSize,
        });

        setHabitLogs(fetchedHabitLogs);

        if (fetchedHabitLogs.length < pageSize) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching habit logs:', error);
        setError('Failed to load habit logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialHabitLogs();
  }, [habitId, pageSize]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = currentPage + 1;
      const fetchedHabitLogs = await fetchHabitLogs({
        habitId,
        pageNumber: nextPage,
        pageSize,
      });

      setHabitLogs((prevHabitLogs) => [...prevHabitLogs, ...fetchedHabitLogs]);

      if (fetchedHabitLogs.length < pageSize) {
        setHasMore(false);
      }

      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      setError('Failed to load more habit logs.');
    } finally {
      setLoading(false);
    }
  };

  return { habitLogs, loading, error, hasMore, loadMore };
};
