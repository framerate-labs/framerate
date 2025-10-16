import { z } from 'zod';

export const trendingFilterSchema = z.union([
	z.literal('all'),
	z.literal('movie'),
	z.literal('tv'),
	z.literal('person')
]);

export const trendingTimeWindowSchema = z.union([z.literal('day'), z.literal('week')]);

const mediaBaseSchema = z.object({
	adult: z.boolean(),
	backdrop_path: z.string().nullable(),
	genre_ids: z.array(z.number()),
	id: z.number(),
	original_language: z.string(),
	overview: z.string(),
	popularity: z.number(),
	poster_path: z.string().nullable()
});

const trendingMovieSchema = mediaBaseSchema.extend({
	media_type: z.literal('movie'),
	original_title: z.string(),
	release_date: z.string(),
	title: z.string(),
	vote_average: z.number(),
	vote_count: z.number(),
	video: z.boolean()
});

const trendingTVSchema = mediaBaseSchema.extend({
	media_type: z.literal('tv'),
	first_air_date: z.string(),
	name: z.string(),
	origin_country: z.array(z.string()),
	original_name: z.string(),
	vote_average: z.number(),
	vote_count: z.number()
});

const trendingPersonSchema = z.object({
	adult: z.boolean(),
	gender: z.number(),
	id: z.number(),
	known_for_department: z.string(),
	media_type: z.literal('person'),
	name: z.string(),
	original_name: z.string(),
	popularity: z.number(),
	profile_path: z.string().nullable()
});

export const trendingItemSchema = z.discriminatedUnion(
	'media_type',
	[trendingMovieSchema, trendingTVSchema, trendingPersonSchema]
);

export const trendingResponseSchema = z.object({
	page: z.number(),
	results: z.array(trendingItemSchema),
	total_pages: z.number(),
	total_results: z.number()
});

// Re-export types from types/trending.ts
export type {
	TrendingFilter,
	TrendingTimeWindow,
	TrendingApiItem,
	TrendingMovie,
	TrendingTV,
	TrendingPerson,
	Trending
} from '../types/trending';
