'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import NewHabitLogForm from '@/components/logs/NewHabitLogForm';

const NewLogPage: FC = () => {
  return (
    <main>
      <NewHabitLogForm />
    </main>
  );
};

export default withAuth(NewLogPage);
