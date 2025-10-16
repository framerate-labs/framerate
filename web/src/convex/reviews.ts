import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

/**
 * Query: Get average rating and review count for a movie or TV series
 */
export const getAverageRating = query({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number()
	},
	handler: async (ctx, args) => {
		// Find the media by TMDB ID
		const mediaTable = args.mediaType === 'movie' ? 'movie' : 'tv';
		const media = await ctx.db
			.query(mediaTable)
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (!media) {
			return { avgRating: null, reviewCount: 0 };
		}

		// Get all reviews for this media
		const reviewTable = args.mediaType === 'movie' ? 'movieReview' : 'tvReview';
		const mediaIdField = args.mediaType === 'movie' ? 'movieId' : 'seriesId';

		const reviews = await ctx.db
			.query(reviewTable)
			.withIndex(args.mediaType === 'movie' ? 'by_movie' : 'by_series', (q) =>
				q.eq(mediaIdField, media._id)
			)
			.collect();

		if (reviews.length === 0) {
			return { avgRating: null, reviewCount: 0 };
		}

		const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
		const avgRating = sum / reviews.length;

		return {
			avgRating,
			reviewCount: reviews.length
		};
	}
});

/**
 * Mutation: Add or update a review/rating
 */
export const addReview = mutation({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number(),
		rating: v.float64()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to add a review');
		}

		const userId = session.user.id;

		// Validate rating
		if (args.rating < 0.5 || args.rating > 5 || args.rating % 0.5 !== 0) {
			throw new ConvexError('Rating must be between 0.5 and 5 in 0.5 increments');
		}

		// Find or create the media in database
		const mediaTable = args.mediaType === 'movie' ? 'movie' : 'tv';
		let media = await ctx.db
			.query(mediaTable)
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (!media) {
			// Media doesn't exist yet, we need to fetch it from TMDB first
			// For now, throw an error - the details page should have already created it
			throw new ConvexError('Media not found. Please view the details page first.');
		}

		const reviewTable = args.mediaType === 'movie' ? 'movieReview' : 'tvReview';
		const mediaIdField = args.mediaType === 'movie' ? 'movieId' : 'seriesId';

		// Check if review already exists
		const existingReview = await ctx.db
			.query(reviewTable)
			.withIndex('by_user_and_tmdb', (q) => q.eq('userId', userId).eq('tmdbId', args.tmdbId))
			.first();

		const now = Date.now();

		if (existingReview) {
			// Update existing review
			await ctx.db.patch(existingReview._id, {
				rating: args.rating,
				updatedAt: now
			});
			return existingReview._id;
		} else {
			// Create new review
			const reviewData = {
				userId,
				[mediaIdField]: media._id,
				tmdbId: args.tmdbId,
				rating: args.rating,
				createdAt: now,
				updatedAt: now,
				mediaType: args.mediaType,
				liked: false,
				watched: true, // Auto-mark as watched when rating
				review: null
			};

			return await ctx.db.insert(reviewTable, reviewData);
		}
	}
});

/**
 * Mutation: Delete a review/rating
 */
export const deleteReview = mutation({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to delete a review');
		}

		const userId = session.user.id;
		const reviewTable = args.mediaType === 'movie' ? 'movieReview' : 'tvReview';

		// Find the review
		const review = await ctx.db
			.query(reviewTable)
			.withIndex('by_user_and_tmdb', (q) => q.eq('userId', userId).eq('tmdbId', args.tmdbId))
			.first();

		if (!review) {
			throw new ConvexError('Review not found');
		}

		await ctx.db.delete(review._id);
		return null;
	}
});

/**
 * Mutation: Update like status
 */
export const updateLikeStatus = mutation({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number(),
		liked: v.boolean()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to like');
		}

		const userId = session.user.id;
		const reviewTable = args.mediaType === 'movie' ? 'movieReview' : 'tvReview';

		// Find the review
		const review = await ctx.db
			.query(reviewTable)
			.withIndex('by_user_and_tmdb', (q) => q.eq('userId', userId).eq('tmdbId', args.tmdbId))
			.first();

		if (!review) {
			throw new ConvexError('Must rate the media first before liking');
		}

		await ctx.db.patch(review._id, {
			liked: args.liked,
			updatedAt: Date.now()
		});
	}
});

/**
 * Mutation: Update watched status
 */
export const updateWatchedStatus = mutation({
	args: {
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number(),
		watched: v.boolean()
	},
	handler: async (ctx, args) => {
		// Get authenticated user
		const { auth } = await authComponent.getAuth(async () => ({}), ctx);
		const session = await auth.api.getSession({ headers: ctx.request.headers });

		if (!session?.user?.id) {
			throw new ConvexError('Must be logged in to mark as watched');
		}

		const userId = session.user.id;
		const reviewTable = args.mediaType === 'movie' ? 'movieReview' : 'tvReview';

		// Find the review
		const review = await ctx.db
			.query(reviewTable)
			.withIndex('by_user_and_tmdb', (q) => q.eq('userId', userId).eq('tmdbId', args.tmdbId))
			.first();

		if (!review) {
			throw new ConvexError('Must rate the media first before marking as watched');
		}

		await ctx.db.patch(review._id, {
			watched: args.watched,
			updatedAt: Date.now()
		});
	}
});
