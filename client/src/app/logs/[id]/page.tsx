'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import HabitLog from '@/components/logs/HabitLog';

const ViewHabitLogPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="max-w-screen-sm mx-auto">
      <HabitLog habitLogId={id} />
    </main>
  );
};

export default withAuth(ViewHabitLogPage);
