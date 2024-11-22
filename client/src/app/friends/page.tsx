'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import Link from 'next/link';

const FriendsPage: FC = () => {
  return (
    <main>
      <h1>Friends</h1>
      <Link href="/friends/123">Go here</Link>
    </main>
  );
};

export default withAuth(FriendsPage);
