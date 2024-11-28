import { FC } from 'react';
import { useFetchHabits } from '@/hooks/habits';
import Link from 'next/link';

const HabitStats: FC = () => {
  const { habits, loading, error } = useFetchHabits();

  if (loading || error) {
    return;
  }

  const totalHabitsCount = habits?.length || 0;
  const loggedHabits =
    habits?.filter((habit) => habit.wasLoggedToday).length || 0;

  return (
    <Link href="/habits">
      <section className="flex justify-center items-center bg-indigo-700 text-white p-4 border border-gray-500  min-h-[75px]">
        <h1 className="text-2xl font-bold">
          Hábitos Logueados: {loggedHabits}/{totalHabitsCount}
        </h1>
      </section>
    </Link>
  );
};

export default HabitStats;
