import type { MovieDetails, TVDetails } from '../schema/details';
import type { NormalizedMovieDetails, NormalizedTVDetails } from '../types/details';

// Type for person credits (cast/crew)
type PersonCredit = {
	id: number;
	name: string;
	profile_path: string | null;
};

// Type for creators (TV shows)
type Creator = {
	id: number;
	name: string;
	profile_path: string | null;
};

/**
 * Formats a list of people (directors, creators, etc.) into a comma-separated string.
 *
 * @param people - Array of people with name property
 * @returns Comma-separated string of names, or "N/A" if empty
 */
export function formatNames(people: PersonCredit[] | Creator[]): string {
	if (!people || people.length === 0) {
		return 'N/A';
	}
	return people.map((person) => person.name).join(', ');
}

/**
 * Normalizes movie details from TMDB API format to client format.
 * Converts snake_case to camelCase and adds formatted director info.
 *
 * @param data - Raw movie details from TMDB API
 * @returns Normalized movie details object
 */
export function normalizeMovieDetails(data: MovieDetails): NormalizedMovieDetails {
	// Filter for directors only and limit cast
	const directorList = data.credits.crew.filter((crew) => crew.job === 'Director');
	const director = formatNames(directorList);
	const cast = data.credits.cast.slice(0, 12);

	return {
		mediaType: 'movie',
		id: data.id,
		title: data.title,
		originalTitle: data.original_title,
		releaseDate: data.release_date,
		posterPath: data.poster_path,
		backdropPath: data.backdrop_path,
		overview: data.overview,
		tagline: data.tagline,
		genres: data.genres,
		runtime: data.runtime,
		voteAverage: data.vote_average,
		voteCount: data.vote_count,
		popularity: data.popularity,
		status: data.status,
		homepage: data.homepage,
		imdbId: data.imdb_id,
		budget: data.budget,
		revenue: data.revenue,
		adult: data.adult,
		video: data.video,
		originalLanguage: data.original_language,
		originCountry: data.origin_country,
		belongsToCollection: data.belongs_to_collection
			? {
					id: data.belongs_to_collection.id,
					name: data.belongs_to_collection.name,
					posterPath: data.belongs_to_collection.poster_path,
					backdropPath: data.belongs_to_collection.backdrop_path
				}
			: null,
		productionCompanies: data.production_companies.map((company) => ({
			id: company.id,
			name: company.name,
			logoPath: company.logo_path,
			originCountry: company.origin_country
		})),
		productionCountries: data.production_countries.map((country) => ({
			iso31661: country.iso_3166_1,
			name: country.name
		})),
		spokenLanguages: data.spoken_languages.map((lang) => ({
			englishName: lang.english_name,
			iso6391: lang.iso_639_1,
			name: lang.name
		})),
		credits: {
			cast: cast.map((member) => ({
				id: member.id,
				name: member.name,
				character: member.character,
				profilePath: member.profile_path,
				order: member.order
			})),
			crew: data.credits.crew.map((member) => ({
				id: member.id,
				name: member.name,
				job: member.job,
				department: member.department,
				profilePath: member.profile_path
			}))
		},
		director,
		directorList: directorList.map((d) => ({
			id: d.id,
			name: d.name,
			profilePath: d.profile_path,
			job: d.job,
			department: d.department
		}))
	};
}

/**
 * Normalizes TV details from TMDB API format to client format.
 * Converts snake_case to camelCase, renames TV-specific fields to movie-like names
 * (name → title, original_name → originalTitle, first_air_date → releaseDate),
 * and adds formatted creator info.
 *
 * @param data - Raw TV details from TMDB API
 * @returns Normalized TV details object
 */
export function normalizeTvDetails(data: TVDetails): NormalizedTVDetails {
	// Format creators and limit cast
	const creatorList = data.created_by;
	const creator = formatNames(creatorList);
	const cast = data.credits.cast.slice(0, 12);

	return {
		mediaType: 'tv',
		id: data.id,
		title: data.name,
		originalTitle: data.original_name,
		releaseDate: data.first_air_date,
		posterPath: data.poster_path,
		backdropPath: data.backdrop_path,
		overview: data.overview,
		tagline: data.tagline,
		genres: data.genres,
		voteAverage: data.vote_average,
		voteCount: data.vote_count,
		popularity: data.popularity,
		status: data.status,
		homepage: data.homepage,
		adult: data.adult,
		originalLanguage: data.original_language,
		originCountry: data.origin_country,
		episodeRunTime: data.episode_run_time,
		inProduction: data.in_production,
		languages: data.languages,
		lastAirDate: data.last_air_date,
		lastEpisodeToAir: data.last_episode_to_air
			? {
					id: data.last_episode_to_air.id,
					name: data.last_episode_to_air.name,
					overview: data.last_episode_to_air.overview,
					airDate: data.last_episode_to_air.air_date,
					episodeNumber: data.last_episode_to_air.episode_number,
					seasonNumber: data.last_episode_to_air.season_number,
					stillPath: data.last_episode_to_air.still_path
				}
			: null,
		nextEpisodeToAir: data.next_episode_to_air
			? {
					id: data.next_episode_to_air.id,
					name: data.next_episode_to_air.name,
					overview: data.next_episode_to_air.overview,
					airDate: data.next_episode_to_air.air_date,
					episodeNumber: data.next_episode_to_air.episode_number,
					seasonNumber: data.next_episode_to_air.season_number,
					stillPath: data.next_episode_to_air.still_path
				}
			: null,
		networks: data.networks.map((network) => ({
			id: network.id,
			name: network.name,
			logoPath: network.logo_path,
			originCountry: network.origin_country
		})),
		numberOfEpisodes: data.number_of_episodes,
		numberOfSeasons: data.number_of_seasons,
		productionCompanies: data.production_companies.map((company) => ({
			id: company.id,
			name: company.name,
			logoPath: company.logo_path,
			originCountry: company.origin_country
		})),
		productionCountries: data.production_countries.map((country) => ({
			iso31661: country.iso_3166_1,
			name: country.name
		})),
		seasons: data.seasons.map((season) => ({
			id: season.id,
			name: season.name,
			overview: season.overview,
			airDate: season.air_date,
			episodeCount: season.episode_count,
			seasonNumber: season.season_number,
			posterPath: season.poster_path,
			voteAverage: season.vote_average
		})),
		spokenLanguages: data.spoken_languages.map((lang) => ({
			englishName: lang.english_name,
			iso6391: lang.iso_639_1,
			name: lang.name
		})),
		type: data.type,
		credits: {
			cast: cast.map((member) => ({
				id: member.id,
				name: member.name,
				character: member.character,
				profilePath: member.profile_path,
				order: member.order
			})),
			crew: data.credits.crew.map((member) => ({
				id: member.id,
				name: member.name,
				job: member.job,
				department: member.department,
				profilePath: member.profile_path
			}))
		},
		creator,
		creatorList: creatorList.map((c) => ({
			id: c.id,
			name: c.name,
			profilePath: c.profile_path
		}))
	};
}
