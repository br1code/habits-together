'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';

const EditHabitPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <h1>Edit Habit with Id {id}</h1>
    </main>
  );
};

export default withAuth(EditHabitPage);
