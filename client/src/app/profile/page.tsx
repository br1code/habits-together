'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';

const ProfilePage: FC = () => {
  return (
    <main>
      <h1>Profile</h1>
    </main>
  );
};

export default withAuth(ProfilePage);
