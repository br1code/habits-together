import { FC } from 'react';
import { useFetchHabits } from '@/hooks/habits';
import Link from 'next/link';

const HabitStats: FC = () => {
  const { habits, loading, error } = useFetchHabits();

  if (loading) {
    return (
      <section className="flex justify-center items-center bg-indigo-700 text-white p-4 border border-gray-500 min-h-[75px]">
        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center bg-red-700 text-white p-4 border border-gray-500 min-h-[75px]">
        <h1>Error: {error}</h1>
      </section>
    );
  }

  const totalHabits = habits?.length || 0;
  const loggedHabits =
    habits?.filter((habit) => habit.wasLoggedToday).length || 0;

  return (
    <Link href="/habits">
      <section className="flex justify-center items-center bg-indigo-700 text-white p-4 border border-gray-500  min-h-[75px]">
        <h1 className="text-2xl font-bold">
          Hábitos Logueados: {loggedHabits}/{totalHabits}
        </h1>
      </section>
    </Link>
  );
};

export default HabitStats;
