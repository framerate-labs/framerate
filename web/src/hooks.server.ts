import type { Handle } from '@sveltejs/kit';

import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { SITE_URL } from '$env/static/private';

import { createAuth } from './convex/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	if (SITE_URL && !process.env.SITE_URL) {
		process.env.SITE_URL = SITE_URL;
	}

	event.locals.token = await getToken(createAuth, event.cookies);

	return resolve(event);
};
