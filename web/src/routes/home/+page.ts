import type { PageLoad } from './$types';

import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { getRequestEvent } from '$app/server';

import { api } from '$convex/_generated/api';

export const load: PageLoad = async ({ parent }) => {
	const { locals } = getRequestEvent();

	const { queryClient } = await parent();
	const client = createConvexHttpClient({ token: locals.token });

	const user = await client.query(api.auth.getSafeCurrentUser, {});

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
		user
	};
};
