import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

import { PUBLIC_SITE_URL } from '$env/static/public';

export const authClient = createAuthClient({
	baseURL: PUBLIC_SITE_URL,
	plugins: [usernameClient(), convexClient()]
});
