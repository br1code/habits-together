'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import NewHabitLogForm from '@/components/logs/NewHabitLogForm';

const NewLogPage: FC = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-screen-sm mx-auto flex items-center justify-center p-4">
      <NewHabitLogForm />
    </main>
  );
};

export default withAuth(NewLogPage);
