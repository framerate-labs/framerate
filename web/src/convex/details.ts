import type { MediaType } from '../lib/schema/details';

import { ConvexError, v } from 'convex/values';

import { action, internalMutation, internalQuery, query } from './_generated/server';
import { internal } from './_generated/api';
import { combinedMediaDetailsSchema } from '../lib/schema/details';
import { getToken, parseJson, parseTmdbError } from '../lib/utils/tmdb';
import { normalizeMovieDetails, normalizeTvDetails } from '../lib/utils/details';

export type { NormalizedMovieDetails, NormalizedTVDetails, NormalizedDetails } from '../lib/types/details';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function buildUrl(type: MediaType, id: number): string {
	return `${TMDB_BASE_URL}/${type}/${id}?append_to_response=credits&language=en-US`;
}

/**
 * Internal query: Get movie from database by TMDB ID
 */
export const getMovieByTmdbId = internalQuery({
	args: { tmdbId: v.number() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('movie')
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();
	}
});

/**
 * Internal query: Get TV series from database by TMDB ID
 */
export const getTvByTmdbId = internalQuery({
	args: { tmdbId: v.number() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('tv')
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();
	}
});

/**
 * Internal mutation: Store or update movie in database
 */
export const storeMovie = internalMutation({
	args: {
		tmdbId: v.number(),
		title: v.string(),
		posterPath: v.optional(v.union(v.null(), v.string())),
		backdropPath: v.optional(v.union(v.null(), v.string())),
		releaseDate: v.optional(v.union(v.null(), v.string())),
		slug: v.optional(v.union(v.null(), v.string()))
	},
	handler: async (ctx, args) => {
		// Check if movie exists
		const existing = await ctx.db
			.query('movie')
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (existing) {
			// Update existing movie (only if fields are provided)
			await ctx.db.patch(existing._id, {
				title: args.title,
				posterPath: args.posterPath ?? existing.posterPath,
				backdropPath: args.backdropPath ?? existing.backdropPath,
				releaseDate: args.releaseDate ?? existing.releaseDate,
				slug: args.slug ?? existing.slug
			});
			return existing._id;
		} else {
			// Insert new movie
			return await ctx.db.insert('movie', {
				id: args.tmdbId,
				title: args.title,
				posterPath: args.posterPath ?? null,
				backdropPath: args.backdropPath ?? null,
				releaseDate: args.releaseDate ?? null,
				slug: args.slug ?? null
			});
		}
	}
});

/**
 * Internal mutation: Store or update TV series in database
 */
export const storeTv = internalMutation({
	args: {
		tmdbId: v.number(),
		title: v.string(),
		posterPath: v.optional(v.union(v.null(), v.string())),
		backdropPath: v.optional(v.union(v.null(), v.string())),
		releaseDate: v.optional(v.union(v.null(), v.string())),
		slug: v.optional(v.union(v.null(), v.string()))
	},
	handler: async (ctx, args) => {
		// Check if TV series exists
		const existing = await ctx.db
			.query('tv')
			.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
			.first();

		if (existing) {
			// Update existing series (only if fields are provided)
			await ctx.db.patch(existing._id, {
				title: args.title,
				posterPath: args.posterPath ?? existing.posterPath,
				backdropPath: args.backdropPath ?? existing.backdropPath,
				releaseDate: args.releaseDate ?? existing.releaseDate,
				slug: args.slug ?? existing.slug
			});
			return existing._id;
		} else {
			// Insert new series
			return await ctx.db.insert('tv', {
				id: args.tmdbId,
				title: args.title,
				posterPath: args.posterPath ?? null,
				backdropPath: args.backdropPath ?? null,
				releaseDate: args.releaseDate ?? null,
				slug: args.slug ?? null
			});
		}
	}
});

/**
 * Fetches details for a movie or TV series from TMDB, validates the payload,
 * normalizes field names, stores in database, and returns detailed information including credits.
 *
 * Behavior & safety:
 * - Throws ConvexError if type is "person" (not supported)
 * - Throws ConvexError if API token is missing
 * - Maps TMDB errors into ConvexError with descriptive messages
 * - Validates response with Zod; throws ConvexError on schema mismatch
 * - Stores media in database if not present
 * - Uses database poster/backdrop as overrides if available
 * - Converts snake_case API fields to camelCase
 * - Normalizes TV fields to movie-like keys (title/originalTitle/releaseDate)
 * - Limits cast to top 12 actors and crew to directors only for movies
 * - Returns formatted director/creator names as comma-separated strings
 *
 * @param type - "movie" or "tv" (person not supported)
 * @param id - TMDB media ID
 * @returns Normalized details object with credits
 */
export const get = action({
	args: {
		type: v.union(v.literal('movie'), v.literal('tv'), v.literal('person')),
		id: v.number()
	},
	handler: async (ctx, args) => {
		// Reject person type
		if (args.type === 'person') {
			throw new ConvexError("Sorry, we don't support people search yet!");
		}

		// Ensure TMDB API token is configured
		const token = getToken();

		// Fetch details from TMDB
		const response = await fetch(buildUrl(args.type, args.id), {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		// Handle TMDB API errors with structured error messages
		if (!response.ok) {
			throw new ConvexError(
				parseTmdbError(response.status, response.statusText, await parseJson(response))
			);
		}

		const payload = await response.json();

		// Add media_type to the payload for schema validation
		const payloadWithMediaType = {
			...payload,
			media_type: args.type
		};

		// Validate response shape with Zod schema
		const parsed = combinedMediaDetailsSchema.safeParse(payloadWithMediaType);

		if (!parsed.success) {
			console.error('TMDB API schema validation failed:', parsed.error);
			throw new ConvexError('Invalid data received from TMDB API');
		}

		// Normalize based on media type
		if (parsed.data.media_type === 'movie') {
			const movieData = parsed.data;
			const title = movieData.title;
			const releaseDate = movieData.release_date || null;

			// Store in database
			await ctx.runMutation(internal.details.storeMovie, {
				tmdbId: args.id,
				title,
				posterPath: movieData.poster_path,
				backdropPath: movieData.backdrop_path,
				releaseDate,
				slug: null
			});

			// Get stored media for potential overrides
			const storedMovie = await ctx.runQuery(internal.details.getMovieByTmdbId, {
				tmdbId: args.id
			});

			// Normalize and apply database overrides
			const normalized = normalizeMovieDetails(movieData);
			if (storedMovie) {
				normalized.posterPath = storedMovie.posterPath || normalized.posterPath;
				normalized.backdropPath = storedMovie.backdropPath || normalized.backdropPath;
			}

			return normalized;
		} else {
			const tvData = parsed.data;
			const title = tvData.name;
			const releaseDate = tvData.first_air_date || null;

			// Store in database
			await ctx.runMutation(internal.details.storeTv, {
				tmdbId: args.id,
				title,
				posterPath: tvData.poster_path,
				backdropPath: tvData.backdrop_path,
				releaseDate,
				slug: null
			});

			// Get stored media for potential overrides
			const storedTv = await ctx.runQuery(internal.details.getTvByTmdbId, {
				tmdbId: args.id
			});

			// Normalize and apply database overrides
			const normalized = normalizeTvDetails(tvData);
			if (storedTv) {
				normalized.posterPath = storedTv.posterPath || normalized.posterPath;
				normalized.backdropPath = storedTv.backdropPath || normalized.backdropPath;
			}

			return normalized;
		}
	}
});

/**
 * Query: Get user's review for a specific movie or TV series
 *
 * @param userId - The user's ID (optional, returns null if not provided)
 * @param mediaType - "movie" or "tv"
 * @param tmdbId - TMDB ID of the media
 * @returns User's review object or null if not found
 */
export const getUserReview = query({
	args: {
		userId: v.optional(v.string()),
		mediaType: v.union(v.literal('movie'), v.literal('tv')),
		tmdbId: v.number()
	},
	handler: async (ctx, args) => {
		// Return null if no user is provided
		if (!args.userId) {
			return null;
		}

		if (args.mediaType === 'movie') {
			// Find the movie by TMDB ID
			const movie = await ctx.db
				.query('movie')
				.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
				.first();

			if (!movie) {
				return null;
			}

			// Find user's review for this movie
			return await ctx.db
				.query('movieReview')
				.withIndex('by_user_and_movie', (q) =>
					q.eq('userId', args.userId).eq('movieId', movie._id)
				)
				.first();
		} else {
			// Find the TV series by TMDB ID
			const tv = await ctx.db
				.query('tv')
				.withIndex('by_tmdb_id', (q) => q.eq('id', args.tmdbId))
				.first();

			if (!tv) {
				return null;
			}

			// Find user's review for this series
			return await ctx.db
				.query('tvReview')
				.withIndex('by_user_and_series', (q) =>
					q.eq('userId', args.userId).eq('seriesId', tv._id)
				)
				.first();
		}
	}
});
