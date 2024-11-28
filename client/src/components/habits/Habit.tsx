import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchHabit } from '@/hooks/habits';
import { deleteHabit } from '@/api';
import HabitLogsTable from '../logs/HabitLogsTable';
import { useAuthContext } from '@/contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

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

  const userIsOwner = user?.id === habit?.userId;

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner size={40} />
        </div>
      ) : error || !habit ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="mt-4 text-red-500 text-center">
            Error al cargar el Hábito.
          </p>
        </div>
      ) : (
        <>
          <section className="p-4 bg-white shadow rounded-lg">
            <h1 className="text-xl font-bold text-gray-800 text-center">
              {habit.name}
            </h1>

            <p className="mt-2 text-gray-600 text-center text-sm">
              {habit.rules}
            </p>

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
              <button
                type="button"
                onClick={() => router.back()}
                className="text-indigo-700 underline hover:text-indigo-800"
              >
                Volver
              </button>
            </p>
          </section>

          <HabitLogsTable habitId={habitId} />
        </>
      )}
    </>
  );
};

function getDaysText(days: number): string {
  return days === 1 ? 'día' : 'días';
}

export default Habit;
