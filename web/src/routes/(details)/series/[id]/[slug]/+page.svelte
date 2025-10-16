<script lang="ts">
	import type { PageData } from './$types';

	import { createQuery } from '@tanstack/svelte-query';
	import { useConvexClient } from 'convex-svelte';

	import { api } from '$convex/_generated/api';
	import Backdrop from '$components/details/backdrop.svelte';
	import MediaDetails from '$components/details/media-details.svelte';

	let { data }: { data: PageData } = $props();

	const convex = useConvexClient();

	const seriesQuery = createQuery(() => ({
		queryKey: ['tv-details', data.seriesId],
		queryFn: async () => {
			return await convex.action(api.details.get, {
				type: 'tv',
				id: data.seriesId
			});
		},
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000
	}));

	const series = $derived(seriesQuery.data);
	const pageTitle = $derived(
		series
			? `${series.title} (${series.releaseDate?.slice(0, 4) ?? ''}) | Framerate`
			: 'Framerate'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	{#if series}
		<meta name="description" content={series.overview ?? `Details for ${series.title}`} />
	{/if}
</svelte:head>

{#if series}
	<div class="relative pb-32">
		<Backdrop alt={`Still image from ${series.title}`} backdropPath={series.backdropPath ?? ''} />
		<MediaDetails media={series} title={series.title} posterPath={series.posterPath} />
	</div>
{/if}
