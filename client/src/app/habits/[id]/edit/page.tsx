'use client';

import { FC, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import EditHabitForm from '@/components/habits/EditHabitForm';
import { useFetchHabit } from '@/hooks/habits';
import { useAuthContext } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const EditHabitPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthContext();
  const { habit, loading, error } = useFetchHabit(id);

  // Redirect to the homepage if the user is not the owner of the habit
  useEffect(() => {
    if (!loading && habit && user?.id !== habit.userId) {
      router.push('/');
    }
  }, [loading, habit, user, router]);

  return (
    <main className="min-h-[calc(100vh-4rem)] max-w-screen-sm mx-auto flex items-center justify-center p-4">
      {loading ? (
        <div>
          <LoadingSpinner size={40} />
        </div>
      ) : error || !habit ? (
        <p className="text-red-500 text-center">
          Ocurrió un error al cargar los datos del perfil.
        </p>
      ) : (
        <>
          <EditHabitForm habit={habit} />
        </>
      )}
    </main>
  );
};

export default withAuth(EditHabitPage);
