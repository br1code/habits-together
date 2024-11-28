import { FC } from 'react';
import Link from 'next/link';
import { useFetchHabitLogs } from '@/hooks/habitLogs';
import { HiArrowRight } from 'react-icons/hi';
import LoadingSpinner from '../LoadingSpinner';

interface HabitLogsTableProps {
  habitId: string;
}

const HabitLogsTable: FC<HabitLogsTableProps> = ({ habitId }) => {
  const { habitLogs, loading, error, hasMore, loadMore } = useFetchHabitLogs({
    habitId,
    pageSize: 5,
  });

  const handleLoadMore = () => {
    if (hasMore) {
      loadMore();
    }
  };

  return (
    <section className="bg-white shadow rounded-lg mt-4 p-4">
      {loading && habitLogs.length === 0 ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={40} />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : habitLogs.length > 0 ? (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Últimos Logs
          </h2>

          <table className="w-full border-collapse border border-gray-200 text-center">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">Fecha</th>
                <th className="border border-gray-200 px-4 py-2">Validado</th>
                <th className="border border-gray-200 px-4 py-2">Ver</th>
              </tr>
            </thead>
            <tbody>
              {habitLogs.map((log) => (
                <tr key={log.id}>
                  <td className="border border-gray-200 px-4 py-2">
                    {log.createdAt}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {log.validatedBy.length > 0 ? '✅' : '❌'}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center flex justify-center items-center">
                    <Link
                      href={`/logs/${log.id}`}
                      className="bg-gray-200 text-gray-600 hover:text-gray-700 rounded-full p-4"
                    >
                      <HiArrowRight className="text-xl" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-300 rounded-lg text-white font-semibold flex justify-center items-center"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Cargar más'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Últimos Logs
          </h2>
          <p className="text-gray-500 text-center">No hay logs disponibles.</p>
        </>
      )}
    </section>
  );
};

export default HabitLogsTable;
