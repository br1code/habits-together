'use client';

import { FC, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import EditHabitForm from '@/components/habits/EditHabitForm';
import { useFetchHabit } from '@/hooks/habits';
import { useAuthContext } from '@/contexts/AuthContext';

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

  // TODO: use loading spinner
  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error || !habit) {
    return (
      <div className="text-center text-red-500">Error cargando el Hábito</div>
    );
  }

  return (
    <main>
      <EditHabitForm habit={habit} />
    </main>
  );
};

export default withAuth(EditHabitPage);
