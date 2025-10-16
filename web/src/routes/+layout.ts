import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';

import { browser } from '$app/environment';

// Create QueryClient once and reuse it (singleton pattern)
let queryClient: QueryClient;

function getQueryClient() {
	if (!queryClient) {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					enabled: browser,
					staleTime: 1000 * 60 * 5, // 5 minutes
					gcTime: 1000 * 60 * 10 // 10 minutes
				}
			}
		});
	}
	return queryClient;
}

export const load: LayoutLoad = async ({ data }) => {
	return {
		...data, // Spread server data (includes user)
		queryClient: getQueryClient()
	};
};
