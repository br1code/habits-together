import { FC, useRef, useCallback } from 'react';
import { useFetchHabitLogs } from '@/hooks/habitLogs';
import HabitLogFeedItem from './HabitLogFeedItem';

const HabitLogsFeed: FC = () => {
  const { habitLogs, loading, error, hasMore, loadMore } = useFetchHabitLogs();
  const observer = useRef<IntersectionObserver | null>(null);

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

  if (error) {
    return (
      <section className="bg-black text-white">
        <h1 className="text-xl font-bold mb-4">Error: {error}</h1>
      </section>
    );
  }

  return (
    <section className="bg-black text-white">
      {habitLogs.map((habitLog, index) => {
        const isLastItem = habitLogs.length === index + 1;
        const isFirstItem = index === 0;

        return (
          <div
            key={habitLog.id}
            ref={isLastItem ? lastHabitLogRef : undefined}
            className="overflow-hidden border-b border-gray-800"
          >
            {/* Habit Log Content */}
            <HabitLogFeedItem habitLog={habitLog} isFirstItem={isFirstItem} />
          </div>
        );
      })}
      {loading && <p className="text-center py-4">Loading...</p>}
    </section>
  );
};

export default HabitLogsFeed;
