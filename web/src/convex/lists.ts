import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

/**
 * Query: Get all lists for the authenticated user
 */
export const getLists = query({
	args: {},
	handler: async (ctx) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			return [];
		}

		// TODO: Create list table in schema
		// For now, return empty array
		return [];
	}
});

/**
 * Query: Get list items for a specific media
 */
export const getListItemsForMedia = query({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			return [];
		}

		const userId = session.user.id;

		// Find the media
		const mediaTable = args.mediaType === 'movie' ? 'movie' : 'tv';
		const media = await ctx.db
			.query(mediaTable)
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (!media) {
			return [];
		}

		// TODO: Query list items for this media
		// For now, return empty array
		return [];
	}
});

/**
 * Mutation: Create a new list
 */
export const createList = mutation({
	args: {
		name: v.string()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to create a list');
		}

		const userId = session.user.id;

		// Validate name
		if (!args.name.trim()) {
			throw new ConvexError('List name cannot be empty');
		}

		if (args.name.length > 100) {
			throw new ConvexError('List name must be 100 characters or less');
		}

		// TODO: Create list in database
		// For now, throw error
		throw new ConvexError('Lists are not yet implemented');
	}
});

/**
 * Mutation: Add item to list
 */
export const addListItem = mutation({
	args: {
		listId: v.number(),
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to add to list');
		}

		const userId = session.user.id;

		// Find the media
		const mediaTable = args.mediaType === 'movie' ? 'movie' : 'tv';
		const media = await ctx.db
			.query(mediaTable)
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (!media) {
			throw new ConvexError('Media not found');
		}

		// TODO: Add item to list
		// For now, throw error
		throw new ConvexError('Lists are not yet implemented');
	}
});

/**
 * Mutation: Remove item from list
 */
export const removeListItem = mutation({
	args: {
		listItemId: v.id('listItem')
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to remove from list');
		}

		// TODO: Remove item from list
		// For now, throw error
		throw new ConvexError('Lists are not yet implemented');
	}
});
