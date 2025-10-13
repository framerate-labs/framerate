<script lang="ts">
	type Props = {
		text: string;
		linkText: string;
		linkTo: string;
	};

	let { text, linkText, linkTo }: Props = $props();
</script>

<footer class="absolute right-0 bottom-6 left-0 text-center text-sm font-medium text-gray">
	<div class="gradient-border h-[1px] w-full"></div>
	<p class="mt-6">
		{text}
		<a href={linkTo} class="text-foreground"> {linkText} </a>
		.
	</p>
</footer>
