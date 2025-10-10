<script lang="ts">
	import { Fingerprint, Ticket } from '@lucide/svelte';
</script>

<div class="relative min-h-screen">
	<header>
		<nav class="flex items-center justify-between md:pt-8">
			<a href="/">
				<h1 class="text-lg font-extrabold md:text-3xl">FrameRate</h1>
			</a>

			<div class="flex items-center gap-4 text-sm font-semibold md:gap-10 md:text-base">
				<a href="/login" class="group/login flex items-center gap-1.5 md:gap-2">
					<span class="text-gray group-hover/login:text-foreground transition-colors duration-200">
						<Fingerprint size={18} />
					</span>
					Login
				</a>

				<a href="/signup" class="group/signup peer flex items-center gap-1.5 md:gap-2">
					<span class="text-gray group-hover/signup:text-foreground transition-colors duration-200">
						<Ticket size={18} />
					</span>
					Create free account
				</a>
			</div>
		</nav>
	</header>

	<main class="mx-auto">
		<!-- Image -->
		<section class="relative mx-auto w-full">
			<div class="relative top-10 right-0 left-0 mx-auto w-[95%] md:top-24">
				<img
					src="https://image.tmdb.org/t/p/original/5syRZHBCzzCwkluq7EMrE8vYdlE.jpg"
					alt="Julia Garner in Weapons (2025)."
					width={1920}
					height={1080}
					decoding="async"
					loading="eager"
					class="animate-fade-in aspect-[143/100] rounded-3xl rounded-br-none rounded-bl-none object-cover"
				/>
				<div class="easing-gradient absolute top-0 right-0 left-0 size-full"></div>
				<span
					class="text-foreground/70 absolute top-1/2 -right-8 z-10 -rotate-90 text-[0.625rem] font-medium tracking-wide text-nowrap md:text-sm md:tracking-normal"
				>
					Weapons (2025)
				</span>
			</div>

			<!-- Hero Text -->
			<section
				class="absolute top-11/12 right-0 left-0 z-50 mx-auto mb-5 w-fit text-center md:top-4/5 md:mb-10"
			>
				<div class="mb-4 md:mb-6">
					<h2 class="text-[1.375rem] font-bold md:text-4xl md:tracking-tight">
						From premieres to finales.
					</h2>
					<p class="mt-1 text-sm font-semibold md:mt-2 md:text-[1.125rem] md:tracking-wide">
						Every movie. Every show. Every moment.
					</p>
				</div>

				<!-- CTA -->
				<a href="/signup" class="inline-block">
					<div
						class="rounded-full border border-indigo-600 bg-indigo-800 px-14 py-2 shadow-md inset-shadow-xs inset-shadow-indigo-400 transition-colors duration-150 ease-in-out hover:bg-indigo-700"
					>
						<span class="text-foreground font-semibold tracking-wide"> Start Tracking </span>
					</div>
				</a>
			</section>
		</section>
	</main>
</div>
