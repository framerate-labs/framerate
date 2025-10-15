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

export type TrendingFilter = z.infer<typeof trendingFilterSchema>;
export type TrendingTimeWindow = z.infer<typeof trendingTimeWindowSchema>;
export type TrendingApiItem = z.infer<typeof trendingItemSchema>;

export type TrendingMovie = {
	mediaType: 'movie';
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string;
	posterPath: string | null;
	backdropPath: string | null;
	overview: string;
	genreIds: number[];
	originalLanguage: string;
	popularity: number;
	voteAverage: number;
	voteCount: number;
	video: boolean;
	adult: boolean;
};

export type TrendingTV = {
	mediaType: 'tv';
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string;
	posterPath: string | null;
	backdropPath: string | null;
	overview: string;
	genreIds: number[];
	originalLanguage: string;
	popularity: number;
	voteAverage: number;
	voteCount: number;
	originCountry: string[];
	adult: boolean;
};

export type TrendingPerson = {
	mediaType: 'person';
	id: number;
	name: string;
	originalName: string;
	profilePath: string | null;
	popularity: number;
	adult: boolean;
	knownForDepartment: string;
	gender: number;
};

export type Trending<T extends TrendingFilter = 'all'> = T extends 'movie'
	? TrendingMovie
	: T extends 'tv'
		? TrendingTV
		: T extends 'person'
			? TrendingPerson
			: TrendingMovie | TrendingTV | TrendingPerson;
