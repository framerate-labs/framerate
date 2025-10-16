<script lang="ts">
	import HomeCarousel from '$components/home/home-carousel.svelte';
	import Header from '$components/shared/header.svelte';
	import { useTrending } from '$lib/hooks/use-trending.svelte';

	const moviesQuery = useTrending({
		filter: 'movie',
		timeWindow: 'week'
	});

	const tvQuery = useTrending({
		filter: 'tv',
		timeWindow: 'week'
	});
</script>

<Header />
<main class="min-h-[calc(100vh-var(--header-height))] animate-fade-in pb-14">
	<HomeCarousel trendingMovies={moviesQuery.data ?? []} trendingTv={tvQuery.data ?? []} />
</main>
