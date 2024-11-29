import { HabitLogComment } from '@/types';
import { FC, useState } from 'react';
import Image from 'next/image';
import { createHabitLogComment } from '@/api';
import { formatTimeAgo } from '@/utils/dateUtils';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';
import Link from 'next/link';
import { getProfileLink } from '@/utils/utils';
import { useAuthContext } from '@/contexts/AuthContext';

interface HabitLogCommentsProps {
  habitLogId: string;
  comments: HabitLogComment[];
  refreshHabitLog: () => Promise<void>;
}

const HabitLogComments: FC<HabitLogCommentsProps> = ({
  habitLogId,
  comments,
  refreshHabitLog,
}) => {
  const [newComment, setNewComment] = useState<string>('');

  const { user: authenticatedUser } = useAuthContext();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createHabitLogComment(habitLogId, { text: newComment });
      refreshHabitLog();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <section className="mb-4">
      <div className="px-4 py-2">
        <p className="text-base font-semibold mb-2">Comentarios</p>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                  <Link
                    href={getProfileLink(comment.userId, authenticatedUser!.id)}
                  >
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
                  </Link>
                </div>

                {/* Comment Content */}
                <div>
                  <p className="text-sm">
                    <Link
                      href={getProfileLink(
                        comment.userId,
                        authenticatedUser!.id
                      )}
                    >
                      <span className="font-semibold mr-1">
                        {comment.username}
                      </span>
                    </Link>
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

export default HabitLogComments;
