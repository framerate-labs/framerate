import type { Handle } from '@sveltejs/kit';

import { createConvexHttpClient, getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { api } from './convex/_generated/api.js';
import { createAuth } from './convex/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.token = await getToken(createAuth, event.cookies);

	const client = createConvexHttpClient({ token: event.locals.token });
	const currentUser = await client.query(api.auth.getSafeCurrentUser, {});

	if (currentUser?.userId) {
		event.locals.user = currentUser;
	}

	return resolve(event);
};
