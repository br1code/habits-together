'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';

const HabitsPage: FC = () => {
  return (
    <main>
      <h1>Habits</h1>
    </main>
  );
};

export default withAuth(HabitsPage);
