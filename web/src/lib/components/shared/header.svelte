<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import { userStore } from '$stores/user-store.svelte';

	let { title }: { title?: string } = $props();
</script>

<header class="flex h-24 items-center justify-between md:h-[115px]">
	<div class="flex flex-col justify-center gap-3 md:flex-row md:items-center">
		<a href={resolve('/home')} class="mr-2 flex flex-col text-2xl leading-5">
			<span>FrameRate</span>
		</a>
		<div>
			<h1 class="text-lg font-semibold md:text-xl">
				{page.url.pathname === '/home' ? `Hello, ${userStore.name}` : title}
			</h1>
		</div>
	</div>
</header>
