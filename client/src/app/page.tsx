'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';

const HomePage: FC = () => {
  return (
    <main>
      <h1>Home</h1>
    </main>
  );
};

export default withAuth(HomePage);
