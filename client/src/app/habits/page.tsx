'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import Link from 'next/link';
import HabitsList from '@/components/habits/HabitsList';

const HabitsPage: FC = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center p-4">
      <Link href="/habits/new">
        <button className="px-6 py-2 text-xl text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md">
          Crear Hábito
        </button>
      </Link>

      <HabitsList />
    </main>
  );
};

export default withAuth(HabitsPage);
