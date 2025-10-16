<script lang="ts">
	type Props = {
		title: string;
		director?: string | false;
		creator?: string | false;
		releaseDate: string | null;
	};

	let { title, director, creator, releaseDate }: Props = $props();

	const roleLabel = $derived(director ? 'Directed by ' : creator ? 'Created by ' : '');
	const person = $derived(director || creator || '');
</script>

<h2
	class="font-bespoke text-2xl font-bold leading-tight tracking-tight md:text-4xl md:leading-normal"
>
	{title}
</h2>
<div class="mt-3 text-sm md:mt-2.5 md:text-xl">
	<span class="pr-2 text-sm md:text-base">
		{releaseDate ? releaseDate.slice(0, 4) : ''}
	</span>
	{#if roleLabel}
		<span class="tracking-wide md:text-base">
			{roleLabel}
			<span class="font-medium md:inline-block md:text-base">
				{person}
			</span>
		</span>
	{/if}
</div>
