<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Dialog from '$components/ui/dialog';

	type Props = {
		children: Snippet;
		trigger: Snippet;
		title: string;
		description: string;
	};

	let { children, trigger, title, description }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger child={trigger} />
	<Dialog.Content
		class="top-[30%] w-4/5 border border-white/5 bg-background p-6 caret-foreground outline-none md:top-[50%] md:w-1/2 md:max-w-lg"
	>
		<Dialog.Header class="mb-4">
			<Dialog.Title class="mb-0.5 tracking-wide">{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<div class="h-[300px] overflow-y-scroll">
			{@render children()}
		</div>
	</Dialog.Content>
</Dialog.Root>
