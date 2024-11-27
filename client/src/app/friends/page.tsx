'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import FriendsList from '@/components/users/FriendsList';
import { useFetchFriendProfiles } from '@/hooks/users';

const FriendsPage: FC = () => {
  const { friendProfiles, loading, error } = useFetchFriendProfiles();

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error cargando los Amigos</div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-screen-sm mx-auto p-4">
      <h1 className="font-bold text-3xl text-center mt-2 mb-4">Amigos</h1>

      {!friendProfiles || friendProfiles.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Todavía no tienes amigos.
        </p>
      ) : (
        <FriendsList friendProfiles={friendProfiles} />
      )}
    </main>
  );
};

export default withAuth(FriendsPage);
