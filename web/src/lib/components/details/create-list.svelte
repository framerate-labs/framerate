<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	import { api } from '$convex/_generated/api';

	let isChecked = $state(false);
	let listName = $state('');
	let createListRef: HTMLInputElement | undefined = $state();

	const convex = useConvexClient();

	function handleClickInput() {
		isChecked = !isChecked;
		if (isChecked) {
			setTimeout(() => createListRef?.focus(), 0);
		}
	}

	function toggleCreateList() {
		if (isChecked) {
			isChecked = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!listName.trim()) {
			toast.error('Please enter a valid name');
			return;
		}

		try {
			await convex.mutation(api.lists.createList, {
				name: listName
			});
			toast.success('List created successfully');
			listName = '';
			toggleCreateList();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create list';
			toast.error(message);
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<div class="mb-2.5">
		<label
			class="mb-2.5 flex w-fit cursor-pointer items-center transition-colors duration-150 ease-in-out has-[:checked]:w-full"
		>
			<input
				type="checkbox"
				name="lists"
				value="create"
				class="peer hidden"
				onclick={handleClickInput}
				checked={isChecked}
			/>
			<Plus size={20} color={isChecked ? '#00e4f5' : '#d4d4d8'} class="shrink-0" />
			<span class="ml-1.5 select-none peer-checked:hidden">Create collection</span>
			<div class="hidden peer-checked:flex peer-checked:grow peer-checked:animate-scale-to-right">
				<input
					bind:this={createListRef}
					bind:value={listName}
					type="text"
					autocomplete="off"
					class="relative ml-1 h-8 w-5/6 rounded rounded-r-none border border-r-0 border-white/5 bg-background-light pr-1 pl-2 text-[15px] leading-8 outline-none md:pr-2"
				/>
				<button
					type="submit"
					class="h-8 overflow-x-scroll rounded rounded-tl-none rounded-bl-none border border-l-0 border-white/5 bg-background-light pr-2 pl-1 text-sm font-medium transition-colors duration-150 ease-in outline-none hover:text-[#00e4f5] md:pl-2"
				>
					Create
				</button>
			</div>
		</label>
	</div>
</form>
