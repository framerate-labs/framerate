<script lang="ts">
	import type { NormalizedDetails } from '$lib/types/details';

	import Check from '@lucide/svelte/icons/check';
	import Square from '@lucide/svelte/icons/square';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	import { api } from '$convex/_generated/api';

	type SavedToList = {
		listId: number;
		listItemId: number;
		mediaType: string;
		mediaId: number | null;
	};

	type Props = {
		media: NormalizedDetails;
		savedToLists: SavedToList[];
		onSavedListsChange: (lists: SavedToList[]) => void;
	};

	let { media, savedToLists, onSavedListsChange }: Props = $props();

	const convex = useConvexClient();

	// Query user's lists from Convex
	const listsQuery = useQuery(api.lists.getLists, () => ({}));

	const lists = $derived($listsQuery.data ?? []);
	const { mediaType, id: mediaId } = media;

	async function handleClick(listId: number) {
		const matchedLists = savedToLists.filter((savedList) => savedList.listId === listId);

		try {
			// Add to list
			if (matchedLists.length === 0) {
				await convex.mutation(api.lists.addListItem, {
					listId,
					mediaType,
					tmdbId: mediaId
				});
				// Optimistically update UI
				const newItem: SavedToList = {
					listId,
					listItemId: 0, // Will be set by mutation
					mediaType,
					mediaId
				};
				onSavedListsChange([...savedToLists, newItem]);
				toast.success('Added to list');
			}
			// Remove from list
			else {
				const listItem = matchedLists[0];
				// Note: This assumes listItemId is a Convex ID
				// You may need to adjust based on your actual schema
				await convex.mutation(api.lists.removeListItem, {
					listItemId: listItem.listItemId as any
				});
				const newSavedToLists = savedToLists.filter((l) => l.listId !== listId);
				onSavedListsChange(newSavedToLists);
				toast.success('Removed from list');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update list';
			toast.error(message);
		}
	}

	const idList = $derived(savedToLists.map((saved) => saved.listId));
</script>

{#if lists.length > 0}
	{#each lists as list (list.id)}
		<label class="mb-2.5 flex w-fit cursor-pointer items-center select-none">
			<input
				type="checkbox"
				name="listId"
				value={list.id}
				checked={idList.includes(list.id)}
				onclick={() => handleClick(list.id)}
				class="peer hidden"
			/>
			<Check size={20} color="#00e4f5" class="hidden peer-checked:block" />
			<Square size={20} color="#262626" class="peer-checked:hidden" />
			<span class="ml-1.5">{list.name}</span>
		</label>
	{/each}
{/if}
