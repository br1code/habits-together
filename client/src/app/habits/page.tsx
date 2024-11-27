'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import { useFetchHabits } from '@/hooks/habits';
import Link from 'next/link';
import HabitsList from '@/components/habits/HabitsList';

const HabitsPage: FC = () => {
  const { habits, loading, error } = useFetchHabits();

  // TODO: use loading spinner
  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error cargando los Hábitos</div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center p-4">
      <Link href="/habits/new">
        <button className="mb-6 px-6 py-2 text-xl text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md">
          Crear Hábito
        </button>
      </Link>

      {!habits || habits.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Comienza creando tu primer hábito!
        </p>
      ) : (
        <HabitsList habits={habits} />
      )}
    </main>
  );
};

export default withAuth(HabitsPage);
