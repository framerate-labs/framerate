<script lang="ts">
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { setupConvex } from 'convex-svelte';

	import { page } from '$app/state';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';

	import favicon from '$lib/assets/favicon.svg';
	import { authClient } from '$lib/auth-client';

	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);
	createSvelteAuthClient({ authClient });

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>FrameRate</title>
	<meta
		name="description"
		content="FrameRate is the ultimate social platform for movie and TV enthusiasts. Share your reviews, create and discover lists, and effortlessly track everything you've watched!"
	/>
</svelte:head>

<div
	class={[
		page.url.pathname === '/' ? 'bg-background-landing' : 'bg-background',
		page.url.pathname.includes('film') || page.url.pathname.includes('series')
			? 'py-0'
			: 'px-2 py-4',
		'min-h-full font-manrope antialiased md:px-6'
	]}
>
	<div class="mx-auto size-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1200px]">
		{@render children?.()}
	</div>
</div>
