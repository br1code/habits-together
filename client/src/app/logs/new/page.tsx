'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import NewHabitLogForm from '@/components/logs/NewHabitLogForm';

const NewLogPage: FC = () => {
  return (
    <main className="max-w-screen-sm mx-auto">
      <NewHabitLogForm />
    </main>
  );
};

export default withAuth(NewLogPage);
