'use client';

import { FC } from 'react';
import withAuth from '@/components/withAuth';
import FriendsList from '@/components/users/FriendsList';
import { useFetchFriendProfiles } from '@/hooks/users';
import LoadingSpinner from '@/components/LoadingSpinner';

const FriendsPage: FC = () => {
  const { friendProfiles, loading, error } = useFetchFriendProfiles();

  return (
    <main className="max-w-screen-sm mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner size={40} />
        </div>
      ) : error || !friendProfiles ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="text-red-500 text-center">
            Ocurrió un error al cargar la lista de amigos.
          </p>
        </div>
      ) : friendProfiles.length > 0 ? (
        <>
          <h1 className="font-bold text-2xl text-center mb-4">Amigos</h1>
          <FriendsList friendProfiles={friendProfiles} />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="text-center">Todavía no tienes amigos.</p>
        </div>
      )}
    </main>
  );
};

export default withAuth(FriendsPage);
