import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

const siteUrl = process.env.SITE_URL;

export const authClient = createAuthClient({
	baseURL: siteUrl,
	plugins: [usernameClient(), convexClient()]
});
