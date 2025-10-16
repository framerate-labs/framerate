<script lang="ts">
	import type { NormalizedDetails } from '$lib/types/details';

	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Eye from '@lucide/svelte/icons/eye';
	import Heart from '@lucide/svelte/icons/heart';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	import { api } from '$convex/_generated/api';
	import * as Tooltip from '$components/ui/tooltip';

	import CreateList from './create-list.svelte';
	import ListsModal from './lists-modal.svelte';
	import Lists from './lists.svelte';

	type SavedToList = {
		listId: number;
		listItemId: number;
		mediaType: string;
		mediaId: number | null;
	};

	type Props = {
		media: NormalizedDetails;
	};

	let { media }: Props = $props();

	let savedToLists = $state<SavedToList[]>([]);

	const { id: mediaId, mediaType } = media;

	const convex = useConvexClient();

	// Query user's review to get like/watched status
	const reviewQuery = useQuery(api.details.getUserReview, () => ({
		userId: undefined, // Will be set by auth
		mediaType,
		tmdbId: mediaId
	}));

	// Query list items for this media
	const listItemsQuery = useQuery(api.lists.getListItemsForMedia, () => ({
		mediaType,
		tmdbId: mediaId
	}));

	const isLiked = $derived(reviewQuery.data?.liked ?? false);
	const isWatched = $derived(reviewQuery.data?.watched ?? false);

	$effect(() => {
		const items = listItemsQuery.data ?? [];
		savedToLists = items;
	});

	const actions = [
		{
			id: 1,
			name: 'like' as const,
			content: 'Like',
			icon: Heart,
			active: 'fill-[#FF153A]',
			hover: 'hover:fill-[#FF153A]'
		},
		{
			id: 2,
			name: 'watch' as const,
			content: 'Mark watched',
			icon: Eye,
			active: 'fill-[#00e4f5]',
			hover: 'hover:fill-[#00e4f5]'
		}
	];

	async function handleClick(actionName: 'like' | 'watch') {
		if (!reviewQuery.data) {
			toast.info('Please submit a rating first');
			return;
		}

		try {
			if (actionName === 'like') {
				await convex.mutation(api.reviews.updateLikeStatus, {
					mediaType,
					tmdbId: mediaId,
					liked: !isLiked
				});
			} else {
				await convex.mutation(api.reviews.updateWatchedStatus, {
					mediaType,
					tmdbId: mediaId,
					watched: !isWatched
				});
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update';
			toast.error(message);
		}
	}

	function handleSavedListsChange(lists: SavedToList[]) {
		savedToLists = lists;
	}
</script>

<div class="mt-3 flex w-full items-center justify-evenly gap-0 px-1.5">
	<Tooltip.Provider>
		{#each actions as action (action.id)}
			{@const Icon = action.icon}
			{@const isActive =
				(action.name === 'like' && isLiked) || (action.name === 'watch' && isWatched)}
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child(props)}
						<button {...props.builder} use:props.builder.action type="button">
							<Icon
								size={32}
								fill="#333"
								class={`${action.hover} ${isActive && action.active} ease h-8 cursor-pointer transition-all duration-150 active:scale-90`}
								onclick={() => handleClick(action.name)}
							/>
						</button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content side="top" sideOffset={12}>
					<p>{action.content}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}

		<ListsModal
			title="Update Collections"
			description="Save or remove content from your collections"
		>
			{#snippet trigger()}
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child(props)}
							<button {...props.builder} use:props.builder.action type="button">
								<Bookmark
									size={32}
									fill="#333"
									class={`${savedToLists.length > 0 && 'fill-[#32EC44]'} h-8 cursor-pointer hover:fill-[#32EC44]`}
								/>
							</button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="top" sideOffset={12}>
						<p>Save</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/snippet}
			{#snippet children()}
				<div class="animate-fade-in">
					<CreateList />
					<Lists {media} {savedToLists} onSavedListsChange={handleSavedListsChange} />
				</div>
			{/snippet}
		</ListsModal>
	</Tooltip.Provider>
</div>
