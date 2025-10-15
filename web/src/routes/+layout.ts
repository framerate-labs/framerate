import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';

import { browser } from '$app/environment';

export const load: LayoutLoad = () => {
	// Create QueryClient once on the client side
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60 * 5, // 5 minutes
				gcTime: 1000 * 60 * 10 // 10 minutes
			}
		}
	});

	return { queryClient };
};
