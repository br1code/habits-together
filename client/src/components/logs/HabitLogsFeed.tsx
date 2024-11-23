import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { parse, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFetchHabitLogs } from '@/hooks/habitLogs';

const HabitLogsFeed: FC = () => {
  const { habitLogs, loading, error } = useFetchHabitLogs();

  if (loading) {
    return (
      <section className="bg-black text-white">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-black text-white">
        <h1 className="text-xl font-bold mb-4">Error: {error}</h1>
      </section>
    );
  }

  if (!habitLogs || habitLogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-black text-white">
      {habitLogs.map((habitLog) => (
        <div
          key={habitLog.id}
          className="overflow-hidden border-b border-gray-800"
        >
          <div className="flex items-center px-4 py-2">
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
        </div>
      ))}
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

export default HabitLogsFeed;
