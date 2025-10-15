import type { TrendingFilter, TrendingTimeWindow } from '../lib/schema/trending';

import { ConvexError, v } from 'convex/values';

import { action } from './_generated/server';
import { trendingResponseSchema } from '../lib/schema/trending';
import { getToken, parseJson, parseTmdbError } from '../lib/utils/tmdb';
import { normalizeResults } from '../lib/utils/trending';

const MAX_RESULTS = 18;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/trending';

function buildUrl(filter: TrendingFilter, timeWindow: TrendingTimeWindow): string {
	return `${TMDB_BASE_URL}/${filter}/${timeWindow}?language=en-US`;
}

/**
 * Fetches trending media from TMDB, validates the payload,
 * normalizes field names, and returns a trimmed list.
 *
 * Behavior & safety:
 * - Throws ConvexError if API token is missing
 * - Maps TMDB errors into ConvexError with descriptive messages
 * - Validates response with Zod; throws ConvexError on schema mismatch
 * - Converts snake_case API fields to camelCase
 * - Normalizes TV fields to movie-like keys (title/originalTitle/releaseDate)
 * - Limits results to the top 18 items
 *
 * @param filter - "all" | "movie" | "tv" | "person"
 * @param timeWindow - "day" | "week"
 * @returns Array of normalized trending items
 */
export const get = action({
	args: {
		filter: v.union(v.literal('all'), v.literal('movie'), v.literal('tv'), v.literal('person')),
		timeWindow: v.union(v.literal('day'), v.literal('week'))
	},
	handler: async (_ctx, args) => {
		// Ensure TMDB API token is configured
		const token = getToken();

		// Fetch trending data from TMDB
		const response = await fetch(buildUrl(args.filter, args.timeWindow), {
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

		// Validate response shape with Zod schema
		const parsed = trendingResponseSchema.safeParse(payload);

		if (!parsed.success) {
			console.error('TMDB API schema validation failed:', parsed.error);
			throw new ConvexError('Invalid data received from TMDB API');
		}

		// Normalize field names and cap to 18 items for UI efficiency
		return normalizeResults(parsed.data.results).slice(0, MAX_RESULTS);
	}
});
