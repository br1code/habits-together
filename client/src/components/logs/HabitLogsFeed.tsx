import { FC, useRef, useCallback } from 'react';
import { useFetchHabitLogs } from '@/hooks/habitLogs';
import HabitLogFeedItem from './HabitLogFeedItem';
import LoadingSpinner from '../LoadingSpinner';

const HabitLogsFeed: FC = () => {
  const { habitLogs, loading, error, hasMore, loadMore } = useFetchHabitLogs();
  const observer = useRef<IntersectionObserver | null>(null);

  const isInitialLoading = loading && habitLogs.length === 0;

  const lastHabitLogRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <section className="text-white">
      {isInitialLoading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner size={30} color="white" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="text-red-500 text-center">
            Ocurrió un error al cargar el feed.
          </p>
        </div>
      ) : habitLogs.length > 0 ? (
        <>
          {habitLogs.map((habitLog, index) => {
            const isLastItem = habitLogs.length === index + 1;
            const isFirstItem = index === 0;

            return (
              <div
                key={habitLog.id}
                ref={isLastItem ? lastHabitLogRef : undefined}
                className="overflow-hidden border-b border-gray-800"
              >
                <HabitLogFeedItem
                  habitLog={habitLog}
                  isFirstItem={isFirstItem}
                />
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <LoadingSpinner size={20} color="white" />
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <p className="text-center">
            Parece que nadie ha logueado sus hábitos recientemente...
          </p>
        </div>
      )}
    </section>
  );
};

export default HabitLogsFeed;
