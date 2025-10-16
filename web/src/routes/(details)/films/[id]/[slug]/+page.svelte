<script lang="ts">
	import type { PageData } from './$types';

	import { createQuery } from '@tanstack/svelte-query';
	import { useConvexClient } from 'convex-svelte';

	import { api } from '$convex/_generated/api';
	import Backdrop from '$components/details/backdrop.svelte';
	import MediaDetails from '$components/details/media-details.svelte';

	let { data }: { data: PageData } = $props();

	const convex = useConvexClient();

	const movieQuery = createQuery(() => ({
		queryKey: ['movie-details', data.movieId],
		queryFn: async () => {
			return await convex.action(api.details.get, {
				type: 'movie',
				id: data.movieId
			});
		},
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000
	}));

	const movie = $derived(movieQuery.data);
	const pageTitle = $derived(
		movie ? `${movie.title} (${movie.releaseDate?.slice(0, 4) ?? ''}) | Framerate` : 'Framerate'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	{#if movie}
		<meta name="description" content={movie.overview ?? `Details for ${movie.title}`} />
	{/if}
</svelte:head>

{#if movie}
	<div class="relative pb-32">
		<Backdrop alt={`Still image from ${movie.title}`} backdropPath={movie.backdropPath ?? ''} />
		<MediaDetails media={movie} title={movie.title} posterPath={movie.posterPath} />
	</div>
{/if}
