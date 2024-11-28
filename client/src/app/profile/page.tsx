'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import { useFetchUserProfile } from '@/hooks/users';
import UserProfileCard from '@/components/users/UserProfileCard';
import ExperienceLogsTable from '@/components/users/ExperienceLogsTable';

const ProfilePage: FC = () => {
  const { userProfile, loading, error, refresh } = useFetchUserProfile();

  // TODO: show loading spinner
  if (loading) {
    return (
      <main className="max-w-screen-sm mx-auto p-4">
        <p className="text-red-500 text-center">Cargando...</p>
      </main>
    );
  }

  if (error || !userProfile) {
    return (
      <main className="max-w-screen-sm mx-auto p-4">
        <p className="text-red-500 text-center">
          Ocurrió un error al cargar los datos del perfil.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto p-4">
      <UserProfileCard userProfile={userProfile} refreshUserProfile={refresh} />
      <ExperienceLogsTable />
    </main>
  );
};

export default withAuth(ProfilePage);
