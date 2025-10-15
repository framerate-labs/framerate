import type { PageLoad } from './$types';

import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { api } from '$convex/_generated/api';

export const load: PageLoad = async ({ parent, data }) => {
	const { token } = data;
	const { queryClient } = await parent();
	const client = createConvexHttpClient({ token });

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['trending', 'movie', 'week'],
			queryFn: () => client.action(api.trending.get, { filter: 'movie', timeWindow: 'week' })
		}),
		queryClient.prefetchQuery({
			queryKey: ['trending', 'tv', 'week'],
			queryFn: () => client.action(api.trending.get, { filter: 'tv', timeWindow: 'week' })
		})
	]);

	return {
		...data
	};
};
