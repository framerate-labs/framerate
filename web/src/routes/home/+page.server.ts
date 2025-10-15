import type { PageServerLoad } from './$types';

import { createAuth } from '$convex/auth';

export const load: PageServerLoad = async ({ request, locals }) => {
	// Direct call to BetterAuth to ensure we hit cookie cache on subsequent requests.
	// Convex's HTTP Client drops cookies before calling BetterAuth's methods.
	// We don't need the ctx object for createAuth(), so an explicit any is used.
	// eslint-disable-next-line
	const auth = createAuth({} as any, { optionsOnly: true });
	const session = await auth.api.getSession({
		headers: request.headers
	});

	return {
		user: session?.user ?? null,
		token: locals.token
	};
};
