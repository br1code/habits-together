import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchHabit } from '@/hooks/habits';
import { deleteHabit } from '@/api';
import HabitLogsTable from '../logs/HabitLogsTable';
import { useAuthContext } from '@/contexts/AuthContext';

interface HabitProps {
  habitId: string;
}

const Habit: FC<HabitProps> = ({ habitId }) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { habit, loading, error } = useFetchHabit(habitId);

  const handleDelete = async () => {
    if (confirm('Estás seguro de eliminar este Hábito y todos sus Logs?')) {
      try {
        await deleteHabit(habitId);
        router.push('/habits');
      } catch (error) {
        console.error('Error deleting habit:', error);
        alert('Ocurrió un error, intente nuevamente');
      }
    }
  };

  // TODO: show loading spinner
  if (loading) {
    return <p className="mt-4 text-gray-500">Loading...</p>;
  }
  if (error || !habit) {
    return <p className="mt-4 text-red-500">Failed to load habit details.</p>;
  }

  const userIsOwner = user?.id === habit.userId;

  return (
    <>
      <section className="p-4 bg-white shadow rounded-lg mt-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          {habit.name}
        </h1>

        <p className="mt-2 text-gray-600 text-center text-sm">{habit.rules}</p>

        {habit.wasLoggedToday && habit.wasValidatedToday ? (
          <div className="mt-4 p-2 text-sm text-green-600 bg-green-100 rounded-md text-center">
            Este hábito ha sido logueado y validado el día de hoy
          </div>
        ) : habit.wasLoggedToday ? (
          <div className="text-amber-600 bg-amber-100 mt-4 p-2 text-sm rounded-md text-center">
            Este hábito no ha sido validado el día de hoy
          </div>
        ) : (
          <div className="text-red-600 bg-red-100 mt-4 p-2 text-sm rounded-md text-center">
            Este hábito no ha sido logueado el día de hoy
          </div>
        )}

        {userIsOwner && (
          <div className="mt-6 flex space-x-2">
            <button
              onClick={() => router.push(`/habits/${habitId}/edit`)}
              className="flex-1 px-4 py-2 bg-indigo-700 text-white font-medium rounded hover:bg-indigo-800"
            >
              Editar Hábito
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
            >
              Eliminar Hábito
            </button>
          </div>
        )}

        <p className="mt-6 text-gray-600 text-center">
          Racha actual:{' '}
          <span className="font-bold">
            {habit.currentStreak} {getDaysText(habit.currentStreak)}
          </span>{' '}
          (Record:{' '}
          <span className="font-bold">
            {habit.highestStreak} {getDaysText(habit.highestStreak)}
          </span>
          )
        </p>

        <p className="mt-6 text-sm text-center">
          <Link
            href="/habits"
            className="text-indigo-700 underline hover:text-indigo-800"
          >
            Volver
          </Link>
        </p>
      </section>

      <HabitLogsTable habitId={habitId} />
    </>
  );
};

function getDaysText(days: number): string {
  return days === 1 ? 'día' : 'días';
}

export default Habit;
