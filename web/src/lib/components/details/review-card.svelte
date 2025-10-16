<script lang="ts">
	import type { NormalizedDetails } from '$lib/types/details';

	import { useQuery } from 'convex-svelte';

	import { api } from '$convex/_generated/api';

	import MediaActions from './media-actions.svelte';
	import RatingForm from './rating-form.svelte';

	type Props = {
		media: NormalizedDetails;
	};

	let { media }: Props = $props();

	const averageRatingQuery = useQuery(api.reviews.getAverageRating, () => ({
		mediaType: media.mediaType,
		tmdbId: media.id
	}));

	const avgRating = $derived(averageRatingQuery.data?.avgRating ?? null);
	const reviewCount = $derived(averageRatingQuery.data?.reviewCount ?? 0);
	const isStoredReview = $derived(reviewCount > 0);
	const formatter = Intl.NumberFormat('en', { notation: 'compact' });
</script>

<div
	class="flex h-[206.5px] flex-col items-center justify-between gap-7 rounded bg-background-light p-3 shadow-md ring-1 ring-white/5 lg:px-5 lg:pt-4 lg:pb-5"
>
	<div class="flex w-full items-center justify-between">
		<h3 class={`${!isStoredReview ? 'm-auto' : ''} inline font-medium`}>
			{isStoredReview ? 'Ratings' : 'Leave the first review!'}
		</h3>

		<div>
			<div class="flex h-[40.5px] flex-col text-nowrap">
				{#if isStoredReview && avgRating}
					<p class="font-medium">
						<span class="font-semibold">{avgRating.toFixed(2)}</span> / 5
					</p>
					<span class="text-sm">
						{formatter.format(reviewCount)}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<RatingForm {media} />
	<MediaActions {media} />
</div>
