import { fetchHabitLogs } from '@/api';
import { HabitLog } from '@/types';
import { useEffect, useState } from 'react';

interface UseFetchHabitLogsResult {
  habitLogs: HabitLog[] | null;
  loading: boolean;
  error: string | null;
}

interface FetchHabitLogsParams {
  habitId?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}

export const useFetchHabitLogs = (
  params: FetchHabitLogsParams = {}
): UseFetchHabitLogsResult => {
  const { habitId = null, pageNumber = null, pageSize = null } = params;

  const [habitLogs, setHabitLogs] = useState<HabitLog[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetHabitLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedHabitLogs = await fetchHabitLogs({
          habitId,
          pageNumber,
          pageSize,
        });
        setHabitLogs(fetchedHabitLogs);
      } catch (error) {
        console.error('Error fetching habit logs:', error);
        setError('Failed to load habit logs.');
        setHabitLogs(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetHabitLogs();
  }, [habitId, pageNumber, pageSize]);

  return { habitLogs, loading, error };
};
