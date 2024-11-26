'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import Habit from '@/components/habits/Habit';

const ViewHabitPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="max-w-screen-sm mx-auto">
      <Habit habitId={id} />
    </main>
  );
};

export default withAuth(ViewHabitPage);
