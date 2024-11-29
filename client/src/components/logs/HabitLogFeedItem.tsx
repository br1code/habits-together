import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthContext } from '@/contexts/AuthContext';
import { getProfileLink } from '@/utils/utils';
import { HabitLog } from '@/types';
import { DEFAULT_AVATAR_PICTURE_URL } from '@/constants';
import { formatTimeAgo } from '@/utils/dateUtils';

interface HabitLogFeedItemProps {
  habitLog: HabitLog;
  isFirstItem: boolean;
}

const HabitLogFeedItem: FC<HabitLogFeedItemProps> = ({
  habitLog,
  isFirstItem,
}) => {
  const { user: authenticatedUser } = useAuthContext();

  const validationCount = habitLog.validatedBy.length;
  const habitLogWasValidated = validationCount > 0;

  return (
    <>
      <div className="flex items-center px-4 py-2">
        <Link href={getProfileLink(habitLog.userId, authenticatedUser!.id)}>
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src={habitLog.userProfilePictureUrl || DEFAULT_AVATAR_PICTURE_URL}
              alt={`${habitLog.username}'s avatar`}
              fill
              className="object-cover"
              priority={isFirstItem}
              sizes="40px"
            />
          </div>
        </Link>

        {/* Username */}
        <Link href={getProfileLink(habitLog.userId, authenticatedUser!.id)}>
          <p className="font-semibold text-lg ml-2">{habitLog.username}</p>
        </Link>
      </div>

      <Link href={`/logs/${habitLog.id}`}>
        <div className="relative w-full overflow-hidden">
          <div className="w-full h-0 pb-[125%] relative">
            <Image
              src={habitLog.photoUrl}
              alt={habitLog.habitName}
              fill
              className="object-cover"
              priority={isFirstItem}
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </div>
        </div>
      </Link>

      <div className="px-4 py-2">
        <p className="text-sm">
          <span className="font-semibold mr-1">
            <Link href={getProfileLink(habitLog.userId, authenticatedUser!.id)}>
              {habitLog.username}
            </Link>
          </span>
          {habitLog.habitName}{' '}
          {habitLogWasValidated && '✅'.repeat(validationCount)}
          {/* TODO: use react-icons */}
        </p>
        <p className="text-xs text-gray-400 uppercase mt-1">
          {formatTimeAgo(habitLog.createdAt)}
        </p>
      </div>
    </>
  );
};

export default HabitLogFeedItem;
