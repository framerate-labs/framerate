import type { Handle } from '@sveltejs/kit';

import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { createAuth } from './convex/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.token = await getToken(createAuth, event.cookies);

	return resolve(event);
};
