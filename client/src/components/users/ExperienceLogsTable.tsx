import { useFetchExperienceLogs } from '@/hooks/users';
import { ExperienceLog, ExperienceLogActivityType } from '@/types';
import { formatTimeAgo } from '@/utils/dateUtils';
import Link from 'next/link';
import { FC } from 'react';
import { HiArrowRight } from 'react-icons/hi';

const ExperienceLogsTable: FC = () => {
  const { experienceLogs, loading, error, hasMore, loadMore } =
    useFetchExperienceLogs({
      pageSize: 3,
    });

  const handleLoadMore = () => {
    if (hasMore) {
      loadMore();
    }
  };

  return (
    <section className="bg-white shadow rounded-lg mt-4 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Puntos de Experiencia Obtenidos
      </h2>

      {/* TODO: show loading spinner */}
      {loading && experienceLogs.length === 0 && (
        <p className="text-gray-500 text-center">Cargando...</p>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {experienceLogs.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200 text-center">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2 ">Actividad</th>
              <th className="border border-gray-200 px-4 py-2 ">Ver</th>
            </tr>
          </thead>
          <tbody>
            {experienceLogs.map((log) => (
              <tr key={log.id}>
                <td className="border border-gray-200">
                  {getActivityDescription(log)}
                </td>
                <td className="border border-gray-200 px-4 py-4 text-center flex justify-center items-center">
                  {log.relatedId ? (
                    <Link
                      href={getLinkToRelatedEntity(
                        log.activityType,
                        log.relatedId
                      )}
                      className=" bg-gray-200 text-gray-600 hover:text-gray-700 rounded-full p-2"
                    >
                      <HiArrowRight className="text-xl" />
                    </Link>
                  ) : null}
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

function getActivityDescription(experienceLog: ExperienceLog): React.ReactNode {
  const activityDescriptions = {
    [ExperienceLogActivityType.HABIT_CREATION]: 'Has creado un Hábito',
    [ExperienceLogActivityType.HABIT_LOG_CREATION]: 'Has logueado un Hábito',
    [ExperienceLogActivityType.HABIT_LOG_VALIDATION_PERFORMED]:
      'Has validado el Hábito de un amigo',
    [ExperienceLogActivityType.HABIT_LOG_VALIDATION_RECEIVED]:
      'Un amigo te ha validado un Hábito',
  };

  const description = activityDescriptions[experienceLog.activityType];

  if (!description) return null;

  return (
    <>
      <span className="text-green-600">+{experienceLog.xpGained}XP</span>:{' '}
      {description} (
      <span className="text-gray-600">
        {formatTimeAgo(experienceLog.createdAt)}
      </span>
      )
    </>
  );
}

function getLinkToRelatedEntity(
  activityType: ExperienceLogActivityType,
  targetId: string
): string {
  const linkMap: Record<ExperienceLogActivityType, string> = {
    [ExperienceLogActivityType.HABIT_CREATION]: `/habits/${targetId}`,
    [ExperienceLogActivityType.HABIT_LOG_CREATION]: `/logs/${targetId}`,
    [ExperienceLogActivityType.HABIT_LOG_VALIDATION_PERFORMED]: `/logs/${targetId}`,
    [ExperienceLogActivityType.HABIT_LOG_VALIDATION_RECEIVED]: `/logs/${targetId}`,
  };

  return linkMap[activityType] || '';
}

export default ExperienceLogsTable;
