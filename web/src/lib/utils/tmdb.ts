import { ConvexError } from 'convex/values';

type TMDBError = {
	success?: boolean;
	status_code?: number;
	status_message?: string;
};

/**
 * Retrieves and validates the TMDB API bearer token from environment variables.
 *
 * @throws {ConvexError} If TMDB_TOKEN is not configured
 * @returns The TMDB API bearer token
 */
export function getToken(): string {
	const token = process.env.TMDB_TOKEN;
	if (!token) {
		throw new ConvexError('TMDB bearer token is not configured');
	}

	return token;
}

/**
 * Attempts to parse JSON from a Response object, returning null if parsing fails.
 * Clones the response to avoid consuming the body stream.
 *
 * @param response - The fetch Response object to parse
 * @returns Parsed TMDB error object, or null if parsing fails
 */
export async function parseJson(response: Response): Promise<TMDBError | null> {
	try {
		return (await response.clone().json()) as TMDBError;
	} catch {
		// Non-JSON error body — return null
		return null;
	}
}

/**
 * Formats TMDB API errors into a human-readable error message.
 * Prefers structured TMDB error messages when available, falls back to HTTP status text.
 *
 * @param status - HTTP status code from the response
 * @param statusText - HTTP status text from the response
 * @param tmdbError - Parsed TMDB error object (may be null)
 * @returns Formatted error message string
 */
export function parseTmdbError(
	status: number,
	statusText: string,
	tmdbError: TMDBError | null
): string {
	// Try to use TMDB's structured error message
	if (tmdbError?.status_message) {
		return `TMDB API error ${tmdbError.status_code ?? status}: ${tmdbError.status_message}`;
	}

	// Fall back to HTTP status text
	return `TMDB API error ${status}: ${statusText}`;
}
