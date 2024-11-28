'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import { useFetchUserProfile } from '@/hooks/users';
import UserProfileCard from '@/components/users/UserProfileCard';
import ExperienceLogsTable from '@/components/users/ExperienceLogsTable';
import LoadingSpinner from '@/components/LoadingSpinner';

const ProfilePage: FC = () => {
  const { userProfile, loading, error, refresh } = useFetchUserProfile();

  return (
    <main className="max-w-screen-sm mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner size={40} />
        </div>
      ) : error || !userProfile ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="text-red-500 text-center">
            Ocurrió un error al cargar los datos del perfil.
          </p>
        </div>
      ) : (
        <>
          <UserProfileCard
            userProfile={userProfile}
            refreshUserProfile={refresh}
          />
          <ExperienceLogsTable />
        </>
      )}
    </main>
  );
};

export default withAuth(ProfilePage);
