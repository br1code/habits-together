import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFetchHabitLog } from '@/hooks/habitLogs';
import { deleteHabitlog, validateHabitLog } from '@/api';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '@/utils/dateUtils';
import HabitLogComments from './HabitLogComments';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';
import HabitLogValidations from './HabitLogValidations';
import { getProfileLink } from '@/utils/utils';
import LoadingSpinner from '../LoadingSpinner';

interface HabitLogProps {
  habitLogId: string;
}

const HabitLog: FC<HabitLogProps> = ({ habitLogId }) => {
  const [showActions, setShowActions] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user: authenticatedUser } = useAuthContext();

  const {
    habitLog,
    loading: habitLogLoading,
    error: habitlogError,
    refresh,
  } = useFetchHabitLog(habitLogId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userIsOwner = habitLog?.userId === authenticatedUser?.id;
  const hasUserValidated = habitLog?.validatedBy.some(
    (validator) => validator.userId === authenticatedUser!.id
  );

  const toggleActions = () => setShowActions((prev) => !prev);

  const handleValidateHabitLog = async () => {
    try {
      setActionLoading(true);
      await validateHabitLog(habitLogId);
      refresh();
      setShowActions(false);
    } catch (error) {
      console.error('Error validating habit log:', error);
      alert('Ocurrió un error, intente nuevamente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHabitLog = async () => {
    if (!userIsOwner) return;

    if (!confirm('Estás seguro de eliminar este Log?')) return;

    try {
      await deleteHabitlog(habitLogId);
      alert('El Habit Log ha sido eliminado correctamente');
      router.push('/');
    } catch (error) {
      console.error('Error deleting habit log:', error);
      alert(
        'Ocurrió un error al intentar eliminar el Habit Log, intente nuevamente'
      );
    }
  };

  return (
    <>
      {habitLogLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner size={40} />
        </div>
      ) : habitlogError || !habitLog ? (
        <div className="flex justify-center items-center h-screen text-red-500">
          Ocurrió un error al cargar los datos del perfil.
        </div>
      ) : (
        <>
          {/* Habit Log Header */}
          <section className="flex items-center px-4 py-2">
            <Link href={getProfileLink(habitLog.userId, authenticatedUser!.id)}>
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src={
                    habitLog.userProfilePictureUrl || DEFAULT_AVATAR_PICTURE_URL
                  }
                  alt={`${habitLog.username}'s avatar`}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="40px"
                />
              </div>
            </Link>

            <Link href={getProfileLink(habitLog.userId, authenticatedUser!.id)}>
              <p className="font-semibold text-lg ml-2">{habitLog.username}</p>
            </Link>

            {(userIsOwner || !hasUserValidated) && (
              <div className="ml-auto relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                  onClick={toggleActions}
                >
                  <FiMoreHorizontal size={20} />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                    {!userIsOwner && !hasUserValidated && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={handleValidateHabitLog}
                        disabled={actionLoading}
                      >
                        Validar Log ✅
                      </button>
                    )}
                    {userIsOwner && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        onClick={handleDeleteHabitLog}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Habit Log Picture */}
          <section className="relative w-full overflow-hidden">
            <div className="w-full h-0 pb-[125%] relative">
              <Image
                src={habitLog.photoUrl}
                alt={habitLog.habitName}
                fill
                className="object-cover"
                priority={true}
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
          </section>

          {/* Habit Log Content */}
          <section className="px-4 py-2 border-b">
            <p className="text-lg font-semibold">{habitLog.habitName}</p>
            <p className="text-base text-gray-800">{habitLog.textEntry}</p>
            <p className="text-xs text-gray-400 uppercase mt-1">
              {formatTimeAgo(habitLog.createdAt)}
            </p>
          </section>

          <HabitLogValidations validations={habitLog.validatedBy} />

          <HabitLogComments
            habitLogId={habitLogId}
            comments={habitLog.comments}
            refreshHabitLog={refresh}
          />
        </>
      )}
    </>
  );
};

export default HabitLog;
