'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';

const NewHabitPage: FC = () => {
  return (
    <main>
      <h1>New Habit</h1>
    </main>
  );
};

export default withAuth(NewHabitPage);
