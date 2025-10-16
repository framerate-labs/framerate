<script lang="ts">
	import { browser } from '$app/environment';

	import HomeCarousel from '$components/home/home-carousel.svelte';
	import Header from '$components/shared/header.svelte';
	import { useTrending } from '$lib/hooks/use-trending.svelte';
	import { userStore } from '$stores/user-store.svelte';

	const moviesQuery = useTrending({
		filter: 'movie',
		timeWindow: 'week'
	});

	const tvQuery = useTrending({
		filter: 'tv',
		timeWindow: 'week'
	});

	function setGuestUser() {
		userStore.setUser({
			email: '',
			name: 'Guest',
			username: 'guest'
		});
	}

	$effect(() => {
		if (!browser) return;

		// Decode user from JWT token
		const cookies = document.cookie.split('; ');
		const sessionCookie = cookies.find((c) => c.startsWith('framerate.session_token='));

		if (sessionCookie) {
			try {
				const token = sessionCookie.split('=')[1];
				const payload = JSON.parse(atob(token.split('.')[1]));
				userStore.setUser({
					email: payload.email,
					name: payload.name,
					username: payload.username
				});
			} catch (_e) {
				// Token decode failed, set guest user
				setGuestUser();
			}
		} else {
			setGuestUser();
		}
	});
</script>

<Header />
<main class="min-h-[calc(100vh-var(--header-height))] animate-fade-in pb-14">
	<HomeCarousel trendingMovies={moviesQuery.data ?? []} trendingTv={tvQuery.data ?? []} />
</main>
