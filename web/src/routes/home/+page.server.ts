import type { User } from '$stores/user-store.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	let user: User | null = null;
	if (locals.token) {
		try {
			const payload = JSON.parse(atob(locals.token.split('.')[1]));
			user = {
				email: payload.email,
				name: payload.name,
				username: payload.username
			};
		} catch (_e) {
			// Token decode failed, user stays null
		}
	}

	return {
		user,
		token: locals.token
	};
};
