import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { parse, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFetchHabitLog } from '@/hooks/habitLogs';
import {
  createHabitLogComment,
  deletehabitlog,
  invalidateHabitLog,
  validateHabitLog,
} from '@/api';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HabitLogProps {
  habitLogId: string;
}

const DEFAULT_AVATAR_PICTURE_URL = '/default-avatar.png';

// TODO: please split this into multiple components, this needs a lot of refactor and cleanup
const HabitLog: FC<HabitLogProps> = ({ habitLogId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [showActions, setShowActions] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const router = useRouter();

  const { user } = useAuthContext();

  const {
    habitLog,
    loading: habitLogLoading,
    error: habitlogError,
    refresh,
  } = useFetchHabitLog(habitLogId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createHabitLogComment(habitLogId, { text: newComment });
      refresh();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleActions = () => setShowActions((prev) => !prev);

  const handleValidateHabitLog = async () => {
    try {
      setActionLoading(true);

      const hasUserValidated = habitLog?.validatedBy.some(
        (validator) => validator.userId === user?.userId
      );

      if (hasUserValidated) {
        await invalidateHabitLog(habitLogId);
      } else {
        await validateHabitLog(habitLogId);
      }

      refresh();
      setShowActions(false);
    } catch (error) {
      console.error('Error validating/invalidating habit log:', error);
      alert('Ocurrió un error, intente nuevamente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHabitLog = async () => {
    if (!habitLog?.isOwner) return;

    try {
      await deletehabitlog(habitLogId);
      alert('El Habit Log ha sido eliminado correctamente');
      router.push('/');
    } catch (error) {
      console.error('Error deleting habit log:', error);
      alert(
        'Ocurrió un error al intentar eliminar el Habit Log, intente nuevamente'
      );
    }
  };

  // TODO: show loading spinner
  if (habitLogLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (habitlogError || !habitLog) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Ocurrió un error al cargar los datos del perfil.
      </div>
    );
  }

  const wasValidated = habitLog.validatedBy.length > 0;
  const hasUserValidated = habitLog.validatedBy.some(
    (validator) => validator.userId === user?.userId
  );

  return (
    <section>
      <div className="flex items-center px-4 py-2">
        <Link href={getProfileLink(habitLog.userId, habitLog.isOwner)}>
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src={habitLog.userProfilePictureUrl || DEFAULT_AVATAR_PICTURE_URL}
              alt={`${habitLog.username}'s avatar`}
              fill
              className="object-cover"
              priority={true}
              sizes="40px"
            />
          </div>
        </Link>

        {/* Username */}
        <Link href={getProfileLink(habitLog.userId, habitLog.isOwner)}>
          <p className="font-semibold text-lg ml-2">{habitLog.username}</p>
        </Link>

        {/* Actions Button */}
        <div className="ml-auto relative">
          <button
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={toggleActions}
          >
            <FiMoreHorizontal size={20} />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              {!habitLog.isOwner && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={handleValidateHabitLog}
                  disabled={actionLoading}
                >
                  {hasUserValidated ? 'Invalidar Log ❌' : 'Validar Log✅'}
                </button>
              )}

              {habitLog.isOwner && (
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
      </div>

      <div className="relative w-full overflow-hidden">
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
      </div>

      <div className="px-4 py-2 border-b">
        <p className="text-lg font-semibold">{habitLog.habitName}</p>

        <p className="text-base text-gray-800">{habitLog.textEntry}</p>
        <p className="text-xs text-gray-400 uppercase mt-1">
          {formatTimeAgo(habitLog.createdAt)}
        </p>
      </div>

      <div className="px-4 py-2 border-b">
        <p className="text-base font-semibold mb-2">Validaciones</p>

        {wasValidated ? (
          <div className="space-y-4">
            {habitLog.validatedBy.map((validation) => (
              <div
                key={validation.userId}
                className="flex items-start space-x-4"
              >
                {/* Avatar */}
                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                  <Image
                    src={
                      validation.userProfilePictureUrl ||
                      DEFAULT_AVATAR_PICTURE_URL
                    }
                    alt={`${validation.username}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>

                {/* Validation Content */}
                <div>
                  <p className="text-sm">
                    <span className="font-semibold mr-2">
                      {validation.username} ✅
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Validado {formatTimeAgo(validation.validatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Este log aún no ha sido validado ❌
          </p>
        )}
      </div>

      <div className="px-4 py-2">
        <p className="text-base font-semibold mb-2">Comentarios</p>
        <div className="space-y-4">
          {habitLog.comments.length > 0 ? (
            habitLog.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                  <Image
                    src={
                      comment.userProfilePictureUrl ||
                      DEFAULT_AVATAR_PICTURE_URL
                    }
                    alt={`${comment.username}'s avatar`}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>

                {/* Comment Content */}
                <div>
                  <p className="text-sm">
                    <span className="font-semibold mr-2">
                      {comment.username}
                    </span>
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Este log aún no ha recibido comentarios
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-700"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:bg-gray-300"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
};

function formatTimeAgo(dateString: string) {
  const date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

function getProfileLink(userId: string, isOwner: boolean): string {
  return isOwner ? `/profile` : `/friends/${userId}`;
}

export default HabitLog;
