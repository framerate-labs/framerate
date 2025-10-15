import type {
	TrendingApiItem,
	TrendingMovie,
	TrendingPerson,
	TrendingTV
} from '../schema/trending';

/**
 * Normalizes an array of trending items from TMDB API format to client format.
 * Dispatches to media-type-specific normalization functions.
 *
 * @param items - Raw trending items from TMDB API
 * @returns Array of normalized trending items with camelCase fields
 */
export function normalizeResults(items: TrendingApiItem[]) {
	return items.map((item) => {
		switch (item.media_type) {
			case 'movie':
				return normalizeMovie(item);
			case 'tv':
				return normalizeTv(item);
			case 'person':
				return normalizePerson(item);
		}
	});
}

/**
 * Converts a movie item from TMDB API format to normalized client format.
 * Transforms snake_case field names to camelCase.
 *
 * @param item - Raw movie item from TMDB API
 * @returns Normalized movie object with camelCase fields
 */
export function normalizeMovie(
	item: Extract<TrendingApiItem, { media_type: 'movie' }>
): TrendingMovie {
	return {
		mediaType: 'movie',
		id: item.id,
		title: item.title,
		originalTitle: item.original_title,
		releaseDate: item.release_date,
		posterPath: item.poster_path,
		backdropPath: item.backdrop_path,
		overview: item.overview,
		genreIds: item.genre_ids,
		originalLanguage: item.original_language,
		popularity: item.popularity,
		voteAverage: item.vote_average,
		voteCount: item.vote_count,
		video: item.video,
		adult: item.adult
	};
}

/**
 * Converts a TV item from TMDB API format to normalized client format.
 * Transforms snake_case field names to camelCase and renames TV-specific fields
 * to movie-like naming (name → title, original_name → originalTitle, first_air_date → releaseDate).
 *
 * @param item - Raw TV item from TMDB API
 * @returns Normalized TV object with camelCase fields and consistent naming
 */
export function normalizeTv(item: Extract<TrendingApiItem, { media_type: 'tv' }>): TrendingTV {
	return {
		mediaType: 'tv',
		id: item.id,
		title: item.name,
		originalTitle: item.original_name,
		releaseDate: item.first_air_date,
		posterPath: item.poster_path,
		backdropPath: item.backdrop_path,
		overview: item.overview,
		genreIds: item.genre_ids,
		originalLanguage: item.original_language,
		popularity: item.popularity,
		voteAverage: item.vote_average,
		voteCount: item.vote_count,
		originCountry: item.origin_country,
		adult: item.adult
	};
}

/**
 * Converts a person item from TMDB API format to normalized client format.
 * Transforms snake_case field names to camelCase.
 *
 * @param item - Raw person item from TMDB API
 * @returns Normalized person object with camelCase fields
 */
export function normalizePerson(
	item: Extract<TrendingApiItem, { media_type: 'person' }>
): TrendingPerson {
	return {
		mediaType: 'person',
		id: item.id,
		name: item.name,
		originalName: item.original_name,
		profilePath: item.profile_path,
		popularity: item.popularity,
		adult: item.adult,
		knownForDepartment: item.known_for_department,
		gender: item.gender
	};
}
