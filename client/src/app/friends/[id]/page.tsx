'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useFetchUserProfile } from '@/hooks/users';
import UserProfileCard from '@/components/users/UserProfileCard';
import HabitsList from '@/components/habits/HabitsList';

const ViewFriendPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { userProfile, loading, error } = useFetchUserProfile(id);

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
      <UserProfileCard userProfile={userProfile} />
      <HabitsList userId={id} />
    </main>
  );
};

export default withAuth(ViewFriendPage);
