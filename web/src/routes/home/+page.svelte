<script lang="ts">
	// import { getTrending } from '$server/trending';

	import type { PageData } from './$types';

	import HomeCarousel from '$components/home/home-carousel.svelte';
	import Header from '$components/shared/header.svelte';
	import { userStore } from '$stores/user-store.svelte';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		if (data.user) {
			const user = {
				email: data.user.email,
				name: data.user.name,
				username: data.user.username as string
			};

			userStore.setUser(user);
		} else {
			const guest = {
				email: '',
				name: 'Guest',
				username: 'guest'
			};

			userStore.setUser(guest);
		}
	});

	// const movieData = getTrending({ filter: 'movie', timeWindow: 'week' });
	// const tvData = getTrending({ filter: 'tv', timeWindow: 'week' });
</script>

<Header />
<main class="min-h-[calc(100vh-var(--header-height))] animate-fade-in pb-14">
	<!-- <HomeCarousel trendingMovies={movie} trendingTv={tv} /> -->
	home
</main>
