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
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Ocurrió un error al cargar los datos del perfil.
      </div>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto">
      <UserProfileCard userProfile={userProfile} refreshUserProfile={refresh} />
      <ExperienceLogsTable />
    </main>
  );
};

export default withAuth(ProfilePage);
