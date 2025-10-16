import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Decode user from JWT token on server
	let user = null;
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
		user
	};
};
