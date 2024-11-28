'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useFetchUserProfile } from '@/hooks/users';
import UserProfileCard from '@/components/users/UserProfileCard';
import HabitsList from '@/components/habits/HabitsList';
import LoadingSpinner from '@/components/LoadingSpinner';

const ViewFriendPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { userProfile, loading, error } = useFetchUserProfile(id);

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
          <UserProfileCard userProfile={userProfile} />
          <HabitsList userId={id} />
        </>
      )}
    </main>
  );
};

export default withAuth(ViewFriendPage);
