import { useFetchHabits } from '@/hooks/habits';
import Link from 'next/link';
import { FC } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import LoadingSpinner from '../LoadingSpinner';

interface HabitsListProps {
  userId?: string;
}

const HabitsList: FC<HabitsListProps> = ({ userId }) => {
  const { habits, loading, error } = useFetchHabits(userId);

  const loggedHabits =
    habits?.filter((habit) => habit.wasLoggedToday).length || 0;
  const totalHabitsCount = habits?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-lg mt-4 p-4">
      {loading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={40} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error cargando los Hábitos
        </div>
      ) : !habits || habits.length === 0 ? (
        <>
          <h2 className="text-lg font-bold text-center mb-4">Hábitos</h2>
          <p className="text-center text-gray-500">
            Todavía no hay hábitos para mostrar
          </p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-center mb-4">
            Hábitos Logueados: {loggedHabits}/{totalHabitsCount}
          </h2>
          <table className="w-full text-left border-collapse">
            <tbody>
              {habits.map((habit) => (
                <tr
                  key={habit.id}
                  className="border-b last:border-none hover:bg-gray-100"
                >
                  <td className="py-2 px-4">{`${
                    habit.name
                  } ${getLoggedAndValidationChecks(
                    habit.wasLoggedToday,
                    habit.wasValidatedToday
                  )}`}</td>
                  <td className="py-2 px-4 text-right">
                    <Link href={`/habits/${habit.id}`}>
                      <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                        <HiArrowRight
                          className="text-gray-600 hover:text-gray-700"
                          size={18}
                        />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

function getLoggedAndValidationChecks(
  wasLogged: boolean,
  wasValidated: boolean
): string {
  const statuses: Record<string, string> = {
    'true,false': '(☑️)', // Logged but not validated
    'true,true': '(✅)', // Logged and validated
    'false,false': '', // Not logged, not validated
    'false,true': '', // (Unrealistic case, but covered)
  };

  return statuses[`${wasLogged},${wasValidated}`] || '';
}

export default HabitsList;
