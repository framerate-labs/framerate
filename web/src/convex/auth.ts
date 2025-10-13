import type { GenericCtx } from '@convex-dev/better-auth';
import type { DataModel } from './_generated/dataModel.js';

import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { bearer, jwt, username } from 'better-auth/plugins';

import { components } from './_generated/api.js';
import { query } from './_generated/server.js';

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = isProduction ? '.frame-rate.io' : undefined;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false }
) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly
		},
		// baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 10,
			maxPasswordLength: 40,
			autoSignIn: true
		},
		session: {
			expiresIn: 1209600, // 14 days
			updateAge: 86400, // 1 day
			cookieCache: {
				enabled: true,
				maxAge: 20 * 60 // 20 minutes
			}
		},
		rateLimit: {
			enabled: true,
			window: 60,
			max: 10
		},
		advanced: {
			cookiePrefix: 'framerate',
			useSecureCookies: isProduction,
			defaultCookieAttributes: {
				// Only set domain in production so cookies set on API are valid for subdomains
				// and avoid localhost issues during development.
				domain: cookieDomain,
				httpOnly: true,
				partitioned: isProduction,
				path: '/',
				sameSite: isProduction ? 'None' : 'Lax'
			}
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			bearer(),
			convex(),
			jwt(),
			username({ minUsernameLength: 1, maxUsernameLength: 20 })
		]
	});
};

// Example fn
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx);
	}
});
