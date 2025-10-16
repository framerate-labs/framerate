import type { PageLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { api } from '$convex/_generated/api';

export const load: PageLoad = async ({ params, parent }) => {
	const { queryClient } = await parent();

	// Guard against invalid IDs to avoid bad network calls
	if (!/^\d+$/.test(params.id)) {
		throw redirect(302, '/home');
	}

	const seriesId = parseInt(params.id, 10);

	// Create Convex client - details are public
	const client = createConvexHttpClient({ token: undefined });

	// Prefetch series details
	await queryClient.prefetchQuery({
		queryKey: ['tv-details', seriesId],
		queryFn: () =>
			client.action(api.details.get, {
				type: 'tv',
				id: seriesId
			}),
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 5 * 60 * 1000 // 5 minutes
	});

	return {
		seriesId
	};
};
