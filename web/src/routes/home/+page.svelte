<script lang="ts">
	import type { PageData } from './$types';

	import HomeCarousel from '$components/home/home-carousel.svelte';
	import Header from '$components/shared/header.svelte';
	import { useTrending } from '$lib/hooks/use-trending.svelte';
	import { userStore } from '$stores/user-store.svelte';

	let { data }: { data: PageData } = $props();

	const moviesQuery = useTrending({
		filter: 'movie',
		timeWindow: 'week'
	});

	const tvQuery = useTrending({
		filter: 'tv',
		timeWindow: 'week'
	});

	$effect(() => {
		const user = data.user
			? {
					email: data.user.email,
					name: data.user.name,
					username: data.user.username as string
				}
			: {
					email: '',
					name: 'Guest',
					username: 'guest'
				};

		userStore.setUser(user);
	});
</script>

<Header />
<main class="min-h-[calc(100vh-var(--header-height))] animate-fade-in pb-14">
	<HomeCarousel trendingMovies={moviesQuery.data ?? []} trendingTv={tvQuery.data ?? []} />
</main>
