import { Habit } from '@/types';
import Link from 'next/link';
import { FC } from 'react';
import { HiArrowRight } from 'react-icons/hi';

interface HabitsListProps {
  habits: Habit[];
}

const HabitsList: FC<HabitsListProps> = ({ habits }) => {
  const loggedHabits =
    habits?.filter((habit) => habit.wasLoggedToday).length || 0;
  const totalHabitsCount = habits?.length || 0;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold text-center mb-4">
        Habitos Logueados: {loggedHabits}/{totalHabitsCount}
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
                    <HiArrowRight className="text-gray-600" size={18} />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
