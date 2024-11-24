'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import EditHabitForm from '@/components/habits/EditHabitForm';

const EditHabitPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <EditHabitForm habitId={id} />
    </main>
  );
};

export default withAuth(EditHabitPage);
