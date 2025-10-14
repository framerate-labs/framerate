<script lang="ts">
	import { CircleArrowRight, Eye, EyeOff } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import z4 from 'zod/v4';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import * as Form from '$components/ui/form/index.js';
	import { Input } from '$components/ui/input/index.js';
	import { authClient } from '$lib/auth-client';
	import { blacklistChecks } from '$lib/utils/blacklist-check';
	import { signupSchema } from '$schema/authSchema';

	type Props = {
		page: number;
	};

	let { page }: Props = $props();

	const form = superForm(
		{ email: '', name: '', username: '', password: '' },
		{
			validators: zod4Client(signupSchema),
			onSubmit: ({ formData }) => {
				const parsed = signupSchema.safeParse(Object.fromEntries(formData));
				if (!parsed.success) {
					toast.error(parsed.error.message);
					return false;
				}
				return handleSubmit(parsed.data);
			},
			resetForm: false
		}
	);

	const { form: formData, enhance, errors, validate } = form;

	let isEmailValidated = $state(false);
	let isVisible = $state(false);

	// Email validation before page change is necessary for UX
	// Otherwise, email input errors won't be visible to users
	// on page 2.
	async function validateEmail() {
		if (page === 1) {
			const errors = await validate('email');

			if (!errors) {
				isEmailValidated = true;
				page = 2;
			}
		} else {
			page = 1;
		}
	}

	// Improves keyboard navigation by focusing relevant input
	// after email validation
	// $effect(() => {
	// 	if (isEmailValidated) {
	// 		form.enhance('password');
	// 	}
	// });

	$effect(() => {
		const emailErrors = $errors.email;

		if (page === 2 && emailErrors) {
			page = 1;
		}
	});

	// Checks input against filters before creating user in DB
	async function handleSubmit(formData: z4.infer<typeof signupSchema>) {
		const result = blacklistChecks(formData);

		if (result.status === 'error') {
			toast.error(result.message);
			return;
		}

		if (result.status === 'success') {
			const { email, name, username, password } = formData;

			(async function signup() {
				await authClient.signUp.email(
					{
						email,
						name,
						username,
						password
					},
					{
						onRequest: () => {
							toast.loading('Creating account...', { id: 'signup' });
						},
						onSuccess: async () => {
							toast.dismiss('signup');
							toast.success('Account created!');

							const { data: sessionData } = await authClient.getSession();

							// ADD LIST CREATION
							// if (sessionData) {
							// 	await createList('Watchlist');
							// }

							goto(resolve('/home'));
						},
						onError: (ctx) => {
							toast.dismiss('signup');
							const errorCode = ctx.error.code;
							const errorMessage = ctx.error.message;

							switch (errorCode) {
								case 'USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER':
									$errors.username = ['Username is taken'];
									toast.error('Username is already taken. Please try another one', {
										duration: 6000
									});
									break;
								case 'USER_ALREADY_EXISTS':
									$errors.email = ['Account already exists'];
									toast.error(
										'An account with this email already exists. Did you mean to log in?',
										{ duration: 6000 }
									);
									break;
								default:
									toast.error(errorMessage, { duration: 6000 });
									console.error(ctx.error);
							}
						}
					}
				);
			})();
		}
	}

	const groupedFields = [
		{
			fieldName: 'name' as const,
			label: 'Name',
			placeholder: 'your name (public)',
			description: 'Enter your name. It does not have to be your full name and will be public.'
		},
		{
			fieldName: 'username' as const,
			label: 'Username',
			placeholder: 'your username (public)',
			description: 'This is your public username.'
		}
	];
</script>

<form method="POST" use:enhance>
	{#if page === 1}
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="sr-only">Email</Form.Label>
					<div
						class={[
							'relative flex items-center rounded-full bg-white/[0.01] ring-1 ring-white/10',
							$errors.email && '!ring-red-500'
						]}
					>
						<Input
							{...props}
							bind:value={$formData.email}
							type="email"
							placeholder="account email"
							autocomplete="email"
							class="auth-input grow rounded-l-full rounded-r-none bg-transparent ring-0 ring-transparent"
						/>
						<button
							type="button"
							onclick={validateEmail}
							class={[
								'flex cursor-pointer flex-col items-center pr-2.5 text-gray transition-colors duration-200 hover:text-foreground',
								isEmailValidated ? 'hidden' : 'block'
							]}
						>
							<CircleArrowRight size={28} strokeWidth={1.1} />
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description class="sr-only"
				>This is the email you used to create your account.</Form.Description
			>
			<Form.FieldErrors class="mt-1 ml-6 max-w-full font-medium text-wrap text-red-500" />
		</Form.Field>
	{:else}
		{#each groupedFields as fieldItem, i (fieldItem.fieldName)}
			{@const { fieldName, label, placeholder, description } = fieldItem}

			<Form.Field {form} name={fieldName} class="space-y-6">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="sr-only">{label}</Form.Label>
						<Input
							{...props}
							bind:value={$formData[fieldName]}
							type="text"
							{placeholder}
							autocomplete={fieldName}
							autofocus={fieldName === 'name'}
							class={['auth-input', $errors[fieldName] && 'ring-1 ring-red-500']}
						/>
					{/snippet}
				</Form.Control>
				<Form.Description class="sr-only">{description}</Form.Description>
				<Form.FieldErrors class="mt-1 ml-6 max-w-full font-medium text-wrap text-red-500" />
			</Form.Field>
		{/each}

		<Form.Field {form} name="password" class="mt-3">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="sr-only">Password</Form.Label>
					<div
						class={[
							'relative flex items-center rounded-full bg-white/[0.01] ring-1 ring-white/10',
							$errors.password && 'ring-1 !ring-red-500'
						]}
					>
						<Input
							{...props}
							bind:value={$formData.password}
							type={isVisible ? 'text' : 'password'}
							placeholder="your password"
							autocomplete="new-password"
							class="auth-input rounded-l-full rounded-r-none bg-transparent ring-0 ring-transparent"
						/>
						<button
							type="button"
							onclick={() => (isVisible ? (isVisible = false) : (isVisible = true))}
							class="flex cursor-pointer flex-col items-center pr-3 text-gray transition-colors duration-200 hover:text-foreground"
						>
							{#if isVisible}
								<Eye size={28} strokeWidth={1.1} />
							{:else}
								<EyeOff size={28} strokeWidth={1.1} />
							{/if}
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description class="sr-only"
				>This is the email you used to create your account.</Form.Description
			>
			<Form.FieldErrors class="mt-1 ml-6 max-w-full font-medium text-wrap text-red-500" />
		</Form.Field>

		<Form.Button
			type="submit"
			disabled={$errors.email !== undefined || $errors.password !== undefined}
			class="absolute mt-6 w-full cursor-pointer rounded-full bg-transparent py-1.5 font-semibold text-foreground ring-1 ring-white/10 transition-colors duration-150 hover:bg-white/10"
		>
			Login
		</Form.Button>
	{/if}

	{#if isEmailValidated}
		<Form.Field {form} name="password" class="mt-3">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="sr-only">Password</Form.Label>
					<div
						class={[
							'relative flex items-center rounded-full bg-white/[0.01] ring-1 ring-white/10',
							$errors.password && 'ring-1 !ring-red-500'
						]}
					>
						<Input
							{...props}
							bind:value={$formData.password}
							type={isVisible ? 'text' : 'password'}
							placeholder="your password"
							autocomplete="current-password"
							class="auth-input rounded-l-full rounded-r-none bg-transparent ring-0 ring-transparent"
						/>
						<button
							type="button"
							onclick={() => (isVisible ? (isVisible = false) : (isVisible = true))}
							class="flex cursor-pointer flex-col items-center pr-3 text-gray transition-colors duration-200 hover:text-foreground"
						>
							{#if isVisible}
								<Eye size={28} strokeWidth={1.1} />
							{:else}
								<EyeOff size={28} strokeWidth={1.1} />
							{/if}
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description class="sr-only"
				>This is the email you used to create your account.</Form.Description
			>
			<Form.FieldErrors class="mt-1 ml-6 max-w-full font-medium text-wrap text-red-500" />
		</Form.Field>

		<Form.Button
			type="submit"
			disabled={$errors.email !== undefined || $errors.password !== undefined}
			class="absolute mt-6 w-full cursor-pointer rounded-full bg-transparent py-1.5 font-semibold text-foreground ring-1 ring-white/10 transition-colors duration-150 hover:bg-white/10"
		>
			Login
		</Form.Button>
	{/if}
</form>
