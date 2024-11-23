import { useEffect, useState } from 'react';
import { fetchHabits } from '@/api';
import { Habit } from '@/types';

interface UseFetchHabitsResult {
  habits: Habit[] | null;
  loading: boolean;
  error: string | null;
}

export const useFetchHabits = (): UseFetchHabitsResult => {
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetHabits = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedHabits = await fetchHabits();
        setHabits(fetchedHabits);
      } catch (error) {
        console.error('Error fetching habits:', error);
        setError('Failed to load habits.');
        setHabits(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetHabits();
  }, []);

  return { habits, loading, error };
};
