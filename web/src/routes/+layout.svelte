<script lang="ts">
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { setupConvex } from 'convex-svelte';

	import { page } from '$app/state';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';

	import favicon from '$lib/assets/favicon.svg';
	import { authClient } from '$lib/auth-client';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);
	createSvelteAuthClient({ authClient });

	const pathname = $derived(page.url.pathname);
	const basePaddingClass = $derived(
		pathname.includes('film') || pathname.includes('series') ? 'py-0' : 'px-2 py-4'
	);

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

<Toaster />

<div
	class={[
		pathname === '/' ? 'bg-background-landing' : 'bg-background',
		basePaddingClass,
		'flex min-h-screen flex-col font-manrope antialiased md:px-6 md:py-0'
	]}
>
	<div
		class="relative mx-auto flex w-full max-w-md flex-1 flex-col md:max-w-2xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1200px]"
	>
		{@render children?.()}
	</div>
</div>
