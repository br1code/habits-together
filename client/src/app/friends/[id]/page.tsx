'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';

const ViewFriendPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <h1>View Friend with Id {id}</h1>
    </main>
  );
};

export default withAuth(ViewFriendPage);
