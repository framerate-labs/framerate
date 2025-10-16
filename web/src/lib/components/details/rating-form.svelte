<script lang="ts">
	import type { NormalizedDetails } from '$lib/types/details';

	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	import { api } from '$convex/_generated/api';

	import StarRating from './star-rating.svelte';

	type Props = {
		media: NormalizedDetails;
	};

	let { media }: Props = $props();

	let rating = $state<number | null>(null);

	const convex = useConvexClient();

	async function handleRating(ratingValue: number) {
		try {
			await convex.mutation(api.reviews.addReview, {
				mediaType: media.mediaType,
				tmdbId: media.id,
				rating: ratingValue
			});
			toast.success('Rating saved');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to save rating';
			toast.error(message);
		}
	}

	function handleRatingChange(newRating: number | null) {
		rating = newRating;
	}

	async function handleDelete() {
		try {
			await convex.mutation(api.reviews.deleteReview, {
				mediaType: media.mediaType,
				tmdbId: media.id
			});
			toast.info('Rating removed');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to remove rating';
			toast.error(message);
		}
	}
</script>

<form>
	<StarRating {media} bind:rating {handleRating} onRatingChange={handleRatingChange} onDelete={handleDelete} />
</form>
