import type { Handle } from '@sveltejs/kit';

import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';

import { PUBLIC_SITE_URL } from '$env/static/public';

import { createAuth } from '$convex/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (PUBLIC_SITE_URL && !process.env.PUBLIC_SITE_URL) {
		process.env.PUBLIC_SITE_URL = PUBLIC_SITE_URL;
	}

	event.locals.token = await getToken(createAuth, event.cookies);

	return resolve(event);
};
