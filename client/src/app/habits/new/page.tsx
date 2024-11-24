'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import NewHabitForm from '@/components/habits/NewHabitForm';

const NewHabitPage: FC = () => {
  return (
    <main>
      <NewHabitForm />
    </main>
  );
};

export default withAuth(NewHabitPage);
