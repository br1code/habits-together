'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';

const NewLogPage: FC = () => {
  return (
    <main>
      <h1>New Log</h1>
    </main>
  );
};

export default withAuth(NewLogPage);
