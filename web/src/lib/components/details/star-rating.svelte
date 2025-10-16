<script lang="ts">
	import type { NormalizedDetails } from '$lib/types/details';

	import StarIcon from '@lucide/svelte/icons/star';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	import { api } from '$convex/_generated/api';

	type Props = {
		media: NormalizedDetails;
		rating: number | null;
		handleRating: (rating: number) => Promise<void>;
		onRatingChange: (rating: number | null) => void;
		onDelete: () => void;
	};

	let { media, rating = $bindable(), handleRating, onRatingChange, onDelete }: Props = $props();

	let hover = $state<number | null>(null);

	const convex = useConvexClient();

	// Query user's review for this media
	const reviewQuery = useQuery(api.details.getUserReview, () => ({
		userId: undefined, // Will be set by auth context
		mediaType: media.mediaType,
		tmdbId: media.id
	}));

	const groupedStars = [
		[0.5, 1],
		[1.5, 2],
		[2.5, 3],
		[3.5, 4],
		[4.5, 5]
	];

	// Update rating from database
	$effect(() => {
		const reviewData = reviewQuery.data;
		if (reviewData) {
			const dbRating = reviewData.rating;
			onRatingChange(dbRating);
		} else {
			onRatingChange(null);
		}
	});

	async function handleClick(ratingValue: number) {
		// If clicking same rating, delete it
		if (rating === ratingValue) {
			onRatingChange(null);
			hover = null;
			onDelete();
			return;
		}

		// Otherwise set new rating
		onRatingChange(ratingValue);
		await handleRating(ratingValue);
	}
</script>

<div class="relative">
	<div class="flex items-center justify-center gap-1 md:gap-0">
		{#each groupedStars as group, index (index)}
			<span
				class="relative transition-transform duration-100 ease-out hover:scale-[1.15] active:scale-105"
			>
				{#each group as star (star)}
					{@const ratingValue = star}
					<label class={`${ratingValue % 1 !== 0 ? 'absolute w-[50%] overflow-hidden' : ''}`}>
						<input
							type="radio"
							name="rating"
							value={ratingValue}
							aria-label={`Rate ${ratingValue} stars`}
							onclick={() => handleClick(ratingValue)}
							class="hidden"
						/>
						<StarIcon
							fill={ratingValue <= (hover || rating || 0) ? '#FFD43B' : '#333'}
							class="size-10 md:w-9 lg:h-8 lg:w-10"
							onmouseenter={() => (hover = ratingValue)}
							onmouseleave={() => (hover = null)}
						/>
					</label>
				{/each}
			</span>
		{/each}
	</div>
</div>
