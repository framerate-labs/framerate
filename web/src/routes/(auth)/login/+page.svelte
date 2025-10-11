<script lang="ts">
	import { X } from '@lucide/svelte';

	let reduceMotion = $state(false);

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => (reduceMotion = e.matches);
		mq.addEventListener?.('change', handler);

		return () => mq.removeEventListener?.('change', handler);
	});
</script>

<div>
	{#if !reduceMotion}
		<div
			aria-hidden={true}
			class="login-animated-mesh absolute top-24 right-0 bottom-0 left-0 m-auto h-1/2 w-1/2"
		></div>
	{/if}

	<div
		aria-hidden={true}
		class="absolute top-0 left-0 z-0 size-full bg-black/70 backdrop-blur-3xl"
	></div>

	<main class="relative flex h-full items-center justify-center">
		<a
			href="/"
			aria-label="Close and go to home"
			class="absolute top-2 left-2 rounded-full bg-white/[0.03] p-1 text-foreground transition-colors duration-200 hover:bg-white/5 md:top-8"
		>
			<X size={18} />
		</a>

		<div class="relative bottom-[70px] animate-fade-in">
			<AuthContent
				title="Login to FrameRate"
				description="If you have access to FrameRate, you can enter your email below."
			/>

			<section>
				<LoginForm />
			</section>
		</div>
	</main>

	<AuthFooter text="Don't have an account yet?" linkText="Sign up" linkTo="/signup" />
</div>
