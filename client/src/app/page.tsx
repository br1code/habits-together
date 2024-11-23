'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import HabitStats from '@/components/habits/HabitsStats';
import HabitLogsFeed from '@/components/logs/HabitLogsFeed';

const HomePage: FC = () => {
  return (
    <main className="max-w-screen-sm mx-auto">
      <HabitStats />
      <HabitLogsFeed />
    </main>
  );
};

export default withAuth(HomePage);
