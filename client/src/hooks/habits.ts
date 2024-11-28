import { useEffect, useState } from 'react';
import { fetchHabit, fetchHabits } from '@/api';
import { Habit, HabitDetails } from '@/types';

interface UseFetchHabitsResult {
  habits: Habit[] | null;
  loading: boolean;
  error: string | null;
}

// TODO: use SWR package
export const useFetchHabits = (userId?: string): UseFetchHabitsResult => {
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetHabits = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedHabits = await fetchHabits(userId);
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
  }, [userId]);

  return { habits, loading, error };
};

interface UseFetchHabitResult {
  habit: HabitDetails | null;
  loading: boolean;
  error: string | null;
}

// TODO: use SWR package
export const useFetchHabit = (habitId: string): UseFetchHabitResult => {
  const [habit, setHabit] = useState<HabitDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetHabit = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedHabit = await fetchHabit(habitId);
        setHabit(fetchedHabit);
      } catch (error) {
        console.error('Error fetching habit:', error);
        setError('Failed to load habit.');
        setHabit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetHabit();
  }, [habitId]);

  return { habit, loading, error };
};
