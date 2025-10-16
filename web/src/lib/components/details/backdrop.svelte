<script lang="ts">
	type Props = {
		collection?: boolean;
		alt: string;
		backdropPath: string;
	};

	let { collection = false, alt, backdropPath }: Props = $props();

	let imageLoaded = $state(false);
	let imageRef: HTMLImageElement | undefined = $state();

	function handleImageLoad() {
		imageLoaded = true;
	}

	// Cached images will be complete
	$effect(() => {
		if (imageRef && imageRef.complete) {
			imageLoaded = true;
		}

		// Fallback timer for any edge cases
		const timer = setTimeout(() => {
			imageLoaded = true;
		}, 1000);

		return () => clearTimeout(timer);
	});
</script>

{#if backdropPath}
	<div class="relative m-auto h-auto w-full overflow-hidden">
		<img
			bind:this={imageRef}
			src={`https://image.tmdb.org/t/p/original${backdropPath}`}
			sizes="100vw"
			{alt}
			loading="lazy"
			decoding="async"
			fetchpriority="auto"
			width={1920}
			height={1080}
			onload={handleImageLoad}
			class={`${imageLoaded ? 'animate-fade-in' : 'opacity-0'} ${collection ? 'h-[450px]' : 'h-auto'} w-full object-cover`}
		/>
		<!-- Tablet and Desktop shadow gradient -->
		<div
			class={`${collection ? 'h-[550px]' : 'md:h-[455px] lg:h-[675px] xl:h-[700px]'} backdrop-fade pointer-events-none absolute top-0 hidden w-full bg-no-repeat md:block`}
		></div>
		<!-- Mobile shadow gradient -->
		<div
			class="pointer-events-none absolute top-0 block size-full bg-gradient-to-t from-neutral-900 via-transparent to-transparent bg-no-repeat md:hidden"
		></div>
	</div>
{/if}
