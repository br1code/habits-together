'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import NewHabitForm from '@/components/habits/NewHabitForm';

const NewHabitPage: FC = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-screen-sm mx-auto flex items-center justify-center p-4">
      <NewHabitForm />
    </main>
  );
};

export default withAuth(NewHabitPage);
