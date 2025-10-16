export type NormalizedMovieDetails = {
	mediaType: 'movie';
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string | null;
	posterPath: string | null;
	backdropPath: string | null;
	overview: string | null;
	tagline: string | null;
	genres: Array<{ id: number; name: string }>;
	runtime: number | null;
	voteAverage: number;
	voteCount: number;
	popularity: number;
	status: string;
	homepage: string | null;
	imdbId: string | null;
	budget: number;
	revenue: number;
	adult: boolean;
	video: boolean;
	originalLanguage: string;
	originCountry: string[];
	belongsToCollection: {
		id: number;
		name: string;
		posterPath: string | null;
		backdropPath: string | null;
	} | null;
	productionCompanies: Array<{
		id: number;
		name: string;
		logoPath: string | null;
		originCountry: string;
	}>;
	productionCountries: Array<{ iso31661: string; name: string }>;
	spokenLanguages: Array<{
		englishName: string;
		iso6391: string;
		name: string;
	}>;
	credits: {
		cast: Array<{
			id: number;
			name: string;
			character: string;
			profilePath: string | null;
			order: number;
		}>;
		crew: Array<{
			id: number;
			name: string;
			job: string;
			department: string;
			profilePath: string | null;
		}>;
	};
	director: string;
	directorList: Array<{
		id: number;
		name: string;
		profilePath: string | null;
		job: string;
		department: string;
	}>;
};

export type NormalizedTVDetails = {
	mediaType: 'tv';
	id: number;
	title: string;
	originalTitle: string;
	releaseDate: string | null;
	posterPath: string | null;
	backdropPath: string | null;
	overview: string | null;
	tagline: string | null;
	genres: Array<{ id: number; name: string }>;
	voteAverage: number;
	voteCount: number;
	popularity: number;
	status: string;
	homepage: string | null;
	adult: boolean;
	originalLanguage: string;
	originCountry: string[];
	episodeRunTime: number[];
	inProduction: boolean;
	languages: string[];
	lastAirDate: string | null;
	lastEpisodeToAir: {
		id: number;
		name: string;
		overview: string | null;
		airDate: string | null;
		episodeNumber: number;
		seasonNumber: number;
		stillPath: string | null;
	} | null;
	nextEpisodeToAir: {
		id: number;
		name: string;
		overview: string | null;
		airDate: string | null;
		episodeNumber: number;
		seasonNumber: number;
		stillPath: string | null;
	} | null;
	networks: Array<{
		id: number;
		name: string;
		logoPath: string | null;
		originCountry: string;
	}>;
	numberOfEpisodes: number;
	numberOfSeasons: number;
	productionCompanies: Array<{
		id: number;
		name: string;
		logoPath: string | null;
		originCountry: string;
	}>;
	productionCountries: Array<{ iso31661: string; name: string }>;
	seasons: Array<{
		id: number;
		name: string;
		overview: string | null;
		airDate: string | null;
		episodeCount: number;
		seasonNumber: number;
		posterPath: string | null;
		voteAverage: number;
	}>;
	spokenLanguages: Array<{
		englishName: string;
		iso6391: string;
		name: string;
	}>;
	type: string;
	credits: {
		cast: Array<{
			id: number;
			name: string;
			character: string;
			profilePath: string | null;
			order: number;
		}>;
		crew: Array<{
			id: number;
			name: string;
			job: string;
			department: string;
			profilePath: string | null;
		}>;
	};
	creator: string;
	creatorList: Array<{
		id: number;
		name: string;
		profilePath: string | null;
	}>;
};

export type NormalizedDetails = NormalizedMovieDetails | NormalizedTVDetails;
