'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import Link from 'next/link';
import HabitsList from '@/components/habits/HabitsList';

const HabitsPage: FC = () => {
  return (
    <main className="max-w-screen-sm mx-auto p-4">
      <div className="flex justify-center items-center">
        <Link href="/habits/new">
          <button className="px-6 py-2 text-xl text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-md">
            Crear Hábito
          </button>
        </Link>
      </div>

      <HabitsList />
    </main>
  );
};

export default withAuth(HabitsPage);
