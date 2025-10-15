import type { PageServerLoad } from './$types';

import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { api } from '$convex/_generated/api';

export const load: PageServerLoad = async ({ locals }) => {
	const client = createConvexHttpClient({ token: locals.token });

	// Fetch user data on server
	const user = await client.query(api.auth.getSafeCurrentUser, {});

	// Pass token to universal load function
	return {
		user,
		token: locals.token
	};
};
