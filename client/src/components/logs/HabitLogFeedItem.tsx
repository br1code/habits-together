import { FC } from 'react';
import { HabitLog } from '@/types';
import { parse, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';

interface HabitLogFeedItemProps {
  habitLog: HabitLog;
  isFirstItem: boolean;
}

const DEFAULT_AVATAR_PICTURE_URL = '/default-avatar.png';

const HabitLogFeedItem: FC<HabitLogFeedItemProps> = ({
  habitLog,
  isFirstItem,
}) => (
  <>
    <div className="flex items-center px-4 py-2">
      {/* Avatar */}
      <Image
        src={habitLog.userProfilePictureUrl || DEFAULT_AVATAR_PICTURE_URL}
        alt={`${habitLog.username}'s avatar`}
        width={40}
        height={40}
        className="rounded-full object-cover mr-2"
        priority={isFirstItem}
      />

      {/* Username */}
      <Link href={getProfileLink(habitLog.userId, habitLog.isOwner)}>
        <p className="font-semibold text-lg">{habitLog.username}</p>
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
        <span className="font-semibold">
          <Link href={getProfileLink(habitLog.userId, habitLog.isOwner)}>
            {habitLog.username}
          </Link>
        </span>{' '}
        {habitLog.habitName}
      </p>
      <p className="text-xs text-gray-400 uppercase mt-1">
        {formatTimeAgo(habitLog.createdAt)}
      </p>
    </div>
  </>
);

function formatTimeAgo(dateString: string) {
  const date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

function getProfileLink(userId: string, isOwner: boolean): string {
  return isOwner ? `/profile` : `/friends/${userId}`;
}

export default HabitLogFeedItem;
