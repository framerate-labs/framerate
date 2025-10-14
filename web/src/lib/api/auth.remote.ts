import { redirect } from '@sveltejs/kit';

import { getRequestEvent } from '$app/server';

export function requireAuth() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		redirect(307, '/login');
	}

	return locals.user;
}
