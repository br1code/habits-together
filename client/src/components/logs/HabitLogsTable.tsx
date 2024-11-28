import { FC } from 'react';
import Link from 'next/link';
import { useFetchHabitLogs } from '@/hooks/habitLogs';
import { HiArrowRight } from 'react-icons/hi';

interface HabitLogsTableProps {
  habitId: string;
}

const HabitLogsTable: FC<HabitLogsTableProps> = ({ habitId }) => {
  const { habitLogs, loading, error, hasMore, loadMore } = useFetchHabitLogs({
    habitId,
    pageSize: 10,
  });

  const handleLoadMore = () => {
    if (hasMore) {
      loadMore();
    }
  };

  return (
    <section className="bg-white shadow rounded-lg mt-4 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Últimos Logs
      </h2>

      {/* TODO: show loading spinner */}
      {loading && habitLogs.length === 0 && (
        <p className="text-gray-500 text-center">Cargando logs...</p>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {habitLogs.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 text-center">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Fecha</th>
              <th className="border border-gray-200 px-4 py-2">Validado</th>
              <th className="border border-gray-200 px-4 py-2">Ver Detalles</th>
            </tr>
          </thead>
          <tbody>
            {habitLogs.map((log) => (
              <tr key={log.id}>
                <td className="border border-gray-200 px-4 py-2">
                  {log.createdAt}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {/* TODO: use react-icons */}
                  {log.validatedBy.length > 0 ? '✅' : '❌'}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center flex justify-center items-center">
                  <Link
                    href={`/logs/${log.id}`}
                    className=" bg-gray-200 text-gray-600 hover:text-gray-700 rounded-full p-4"
                  >
                    <HiArrowRight className="text-xl" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="text-gray-500 text-center">No hay logs disponibles.</p>
        )
      )}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-indigo-700 text-white font-medium rounded hover:bg-indigo-800"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </section>
  );
};

export default HabitLogsTable;
