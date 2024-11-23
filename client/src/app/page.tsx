'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import HabitStats from '@/components/habits/HabitsStats';

const HomePage: FC = () => {
  return (
    <main>
      <HabitStats />
    </main>
  );
};

export default withAuth(HomePage);
