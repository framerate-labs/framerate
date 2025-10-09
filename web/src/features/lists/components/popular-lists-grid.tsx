import { useQuery } from '@tanstack/react-query';

import PopularListCard from '@/features/lists/components/popular-list-card';
import PopularListCardSkeleton from '@/features/lists/components/popular-list-card-skeleton';
import { getUserLists } from '@/server/lists';

export default function PopularListsGrid() {
  const { data, isFetching, error } = useQuery({
    queryKey: ['user-lists', 'framerate'],
    queryFn: () => getUserLists('framerate'),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (error) {
    return (
      <div className="mx-auto py-10 text-center text-sm text-white/70">
        Failed to load collections.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="mt-1 mb-4 text-lg font-medium md:text-xl">
        Popular Lists
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {isFetching &&
          (!data || data.length === 0) &&
          Array.from({ length: 10 }).map((_, i) => (
            <PopularListCardSkeleton key={i} />
          ))}

        {data?.map((item) => (
          <PopularListCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
