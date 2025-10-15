import type { GenericCtx } from '@convex-dev/better-auth';
import type { DataModel } from './_generated/dataModel.js';

import { createClient } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { bearer, jwt, username } from 'better-auth/plugins';

import { components } from './_generated/api.js';
import { query } from './_generated/server.js';

const siteUrl = process.env.PUBLIC_SITE_URL!;

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
		baseURL: siteUrl,
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
				maxAge: 10 * 60 // 10 minutes
			}
		},
		rateLimit: {
			enabled: true,
			window: 60,
			max: 10
		},
		advanced: {
			cookiePrefix: 'framerate'
		},
		plugins: [jwt(), bearer(), username({ minUsernameLength: 1, maxUsernameLength: 20 }), convex()]
	});
};

export const getAuthSession = query({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		const data = await auth.api.getSession({ headers });
		return data;
	}
});
