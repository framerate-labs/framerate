import type { Trending, TrendingFilter, TrendingTimeWindow } from '$lib/types/trending';

import { createQuery } from '@tanstack/svelte-query';
import { useConvexClient } from 'convex-svelte';

import { api } from '$convex/_generated/api';

type UseTrendingOptions<T extends TrendingFilter = 'all'> = {
	filter: T;
	timeWindow: TrendingTimeWindow;
};

/**
 * TanStack Query hook for fetching trending media from TMDB.
 * Automatically uses server-prefetched data when available (SSR hydration).
 *
 * @param options - Query configuration
 * @param options.filter - Media type filter ("all" | "movie" | "tv" | "person")
 * @param options.timeWindow - Time window ("day" | "week")
 * @returns TanStack Query result with trending data
 *
 * @example
 * const moviesQuery = useTrending({ filter: 'movie', timeWindow: 'week' });
 * const tvQuery = useTrending({ filter: 'tv', timeWindow: 'day' });
 */
export function useTrending<T extends TrendingFilter = 'all'>(options: UseTrendingOptions<T>) {
	const convex = useConvexClient();

	return createQuery(() => ({
		queryKey: ['trending', options.filter, options.timeWindow],
		queryFn: async () => {
			const result = await convex.action(api.trending.get, {
				filter: options.filter,
				timeWindow: options.timeWindow
			});
			return result as Trending<T>[];
		},
		staleTime: 1000 * 60 * 5, // 5 minutes - trending data doesn't change often
		gcTime: 1000 * 60 * 10 // 10 minutes
	}));
}
