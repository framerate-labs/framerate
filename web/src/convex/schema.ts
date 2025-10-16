import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Convex database schema for movies, TV shows, and user reviews.
 *
 * Key differences from PostgreSQL/Drizzle:
 * - Convex auto-generates _id fields (you don't define them)
 * - User references use v.string() since better-auth users are in a component
 * - Timestamps are v.number() (milliseconds since epoch)
 * - Use indexes for frequently queried fields
 */

const schema = defineSchema({
	// Movie table - stores basic movie metadata
	movie: defineTable({
		id: v.number(), // TMDB ID
		title: v.string(),
		posterPath: v.optional(v.union(v.null(), v.string())),
		backdropPath: v.optional(v.union(v.null(), v.string())),
		releaseDate: v.optional(v.union(v.null(), v.string())), // ISO date string
		slug: v.optional(v.union(v.null(), v.string()))
	})
		.index('by_tmdb_id', ['id']) // Query by TMDB ID
		.index('by_slug', ['slug']), // Query by slug for SEO URLs

	// TV series table - stores basic TV series metadata
	tv: defineTable({
		id: v.number(), // TMDB ID
		title: v.string(),
		posterPath: v.optional(v.union(v.null(), v.string())),
		backdropPath: v.optional(v.union(v.null(), v.string())),
		releaseDate: v.optional(v.union(v.null(), v.string())), // ISO date string
		slug: v.optional(v.union(v.null(), v.string()))
	})
		.index('by_tmdb_id', ['id']) // Query by TMDB ID
		.index('by_slug', ['slug']), // Query by slug for SEO URLs

	// Movie review table - stores user reviews, ratings, and watch status for movies
	movieReview: defineTable({
		userId: v.string(), // Reference to better-auth user
		movieId: v.id('movie'), // Reference to movie table
		tmdbId: v.number(), // Denormalized TMDB ID for easier queries
		rating: v.float64(), // 0.0 - 10.0
		createdAt: v.number(), // Timestamp in milliseconds
		updatedAt: v.number(), // Timestamp in milliseconds
		mediaType: v.literal('movie'),
		liked: v.boolean(),
		watched: v.boolean(),
		review: v.optional(v.union(v.null(), v.string()))
	})
		.index('by_user', ['userId']) // Get all reviews by user
		.index('by_movie', ['movieId']) // Get all reviews for a movie
		.index('by_user_and_movie', ['userId', 'movieId']) // Get specific user's review for a movie
		.index('by_user_and_tmdb', ['userId', 'tmdbId']), // Get review by TMDB ID

	// TV review table - stores user reviews, ratings, and watch status for TV series
	tvReview: defineTable({
		userId: v.string(), // Reference to better-auth user
		seriesId: v.id('tv'), // Reference to tv table
		tmdbId: v.number(), // Denormalized TMDB ID for easier queries
		rating: v.float64(), // 0.0 - 10.0
		createdAt: v.number(), // Timestamp in milliseconds
		updatedAt: v.number(), // Timestamp in milliseconds
		mediaType: v.literal('tv'),
		liked: v.boolean(),
		watched: v.boolean(),
		review: v.optional(v.union(v.null(), v.string()))
	})
		.index('by_user', ['userId']) // Get all reviews by user
		.index('by_series', ['seriesId']) // Get all reviews for a TV series
		.index('by_user_and_series', ['userId', 'seriesId']) // Get specific user's review for a series
		.index('by_user_and_tmdb', ['userId', 'tmdbId']) // Get review by TMDB ID
});

export default schema;
