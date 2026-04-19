<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	let { data } = $props();

	const user = $derived(data.user);

	let form = $state({
		phone: '',
		provider_type: 'private',
		instagram_url: '',
		telegram_url: '',
		facebook_url: '',
		years_experience: 0,
		bio: ''
	});

	let loading = $state(false);
	let error = $state('');

	async function handleSubmit() {
		error = '';

		if (!form.phone.trim()) {
			error = 'Phone number is required';
			return;
		}

		if (form.years_experience < 0) {
			error = 'Years of experience cannot be negative';
			return;
		}

		loading = true;
		try {
			const submissionData = {
				phone: form.phone,
				provider_type: form.provider_type,
				instagram_url: form.instagram_url || null,
				telegram_url: form.telegram_url || null,
				facebook_url: form.facebook_url || null,
				years_experience: form.years_experience,
				bio: form.bio || null
			};

			await api.providerApplications.submit(submissionData);
			await invalidateAll();
			goto('/profile');
		} catch (err) {
			error = err.message || 'Failed to submit application. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Become a Provider | Horizon</title></svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<div class="mb-8">
		<a
			href="/profile"
			class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Profile
		</a>
		<h1 class="mt-4 font-heading text-3xl font-bold">Become a Tour Provider</h1>
		<p class="mt-2 text-muted-foreground">
			Share your travel experiences and create unforgettable tours for travelers.
		</p>
	</div>

	{#if error}
		<div
			class="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
		>
			<svg
				class="h-4 w-4 flex-shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v4M12 16h.01" />
			</svg>
			{error}
		</div>
	{/if}

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
		class="space-y-6"
	>
		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 font-semibold">Contact Information</h2>

			<div class="space-y-4">
				<div>
					<label for="phone" class="mb-2 block text-sm font-medium">
						Phone Number <span class="text-destructive">*</span>
					</label>
					<input
						type="tel"
						id="phone"
						bind:value={form.phone}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="+992 00 000 0000"
						required
					/>
				</div>

				<div>
					<label for="provider_type" class="mb-2 block text-sm font-medium">
						Provider Type <span class="text-destructive">*</span>
					</label>
					<select
						id="provider_type"
						bind:value={form.provider_type}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						required
					>
						<option value="private">Private</option>
						<option value="organization">Organization</option>
					</select>
				</div>
			</div>
		</div>

		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 font-semibold">Social Media Links (Optional)</h2>

			<div class="space-y-4">
				<div>
					<label for="instagram" class="mb-2 block text-sm font-medium">
						<svg class="mr-2 inline h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"
							/>
							<circle cx="12" cy="12" r="4.5" />
						</svg>
						Instagram
					</label>
					<input
						type="url"
						id="instagram"
						bind:value={form.instagram_url}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="https://instagram.com/yourprofile"
					/>
				</div>

				<div>
					<label for="telegram" class="mb-2 block text-sm font-medium">
						<svg class="mr-2 inline h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
							/>
						</svg>
						Telegram
					</label>
					<input
						type="url"
						id="telegram"
						bind:value={form.telegram_url}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="https://t.me/yourprofile"
					/>
				</div>

				<div>
					<label for="facebook" class="mb-2 block text-sm font-medium">
						<svg class="mr-2 inline h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
						Facebook
					</label>
					<input
						type="url"
						id="facebook"
						bind:value={form.facebook_url}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="https://facebook.com/yourprofile"
					/>
				</div>
			</div>
		</div>

		<div class="rounded-lg border bg-card p-6">
			<h2 class="mb-4 font-semibold">About You</h2>

			<div class="space-y-4">
				<div>
					<label for="experience" class="mb-2 block text-sm font-medium">
						Years of Experience
					</label>
					<input
						type="number"
						id="experience"
						bind:value={form.years_experience}
						min="0"
						max="50"
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="0"
					/>
				</div>

				<div>
					<label for="bio" class="mb-2 block text-sm font-medium"> Bio </label>
					<textarea
						id="bio"
						bind:value={form.bio}
						rows="4"
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
						placeholder="Tell us about yourself and your travel experience..."
					></textarea>
					<p class="mt-1 text-xs text-muted-foreground">
						This will be displayed on your public provider profile.
					</p>
				</div>
			</div>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
		>
			{#if loading}
				<svg
					class="h-4 w-4 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
			{/if}
			{loading ? 'Submitting...' : 'Submit Application'}
		</button>

		<p class="text-center text-sm text-muted-foreground">
			Your application will be reviewed by our team. You'll receive an email notification once it's
			processed.
		</p>
	</form>
</div>
