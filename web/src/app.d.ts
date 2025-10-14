// See https://svelte.dev/docs/kit/types#app.d.ts

import { authComponent } from './convex/auth';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type User = ReturnType<typeof authComponent.safeGetAuthUser>;
type UnwrappedUser = UnwrapPromise<User>;

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			token: string | undefined;
			user: UnwrappedUser | undefined;
		}
	}
}

export {};
