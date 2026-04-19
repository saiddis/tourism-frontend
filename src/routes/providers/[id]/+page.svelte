<script>
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';
	import { API_BASE } from '$lib/api/constants.js';
	import { Drawer } from '$lib/components/ui/drawer';
	import { user } from '$lib/stores/auth.js';

	let { data } = $props();

	let drawerOpen = $state(false);
	let renewDrawerOpen = $state(false);
	let loading = $state(false);
	let renewLoading = $state(false);
	let error = $state('');
	let renewError = $state('');
	let selectedTour = $state(null);

	let form = $state({
		name: '',
		description: '',
		destination_id: '',
		start_date: '',
		end_date: '',
		price: '',
		capacity: ''
	});

	let renewForm = $state({
		start_date: '',
		end_date: ''
	});

	let highlightFiles = $state([null]);

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		error = '';
		try {
			const tour = await api.tours.createForProvider({
				name: form.name,
				description: form.description,
				destination_id: parseInt(form.destination_id),
				start_date: new Date(form.start_date).toISOString(),
				end_date: new Date(form.end_date).toISOString(),
				price: parseFloat(form.price),
				capacity: parseInt(form.capacity)
			});

			for (const file of highlightFiles) {
				if (file) {
					await api.tours.createHighlightWithFile(tour.id, file);
				}
			}

			drawerOpen = false;
			form = {
				name: '',
				description: '',
				destination_id: '',
				start_date: '',
				end_date: '',
				price: '',
				capacity: ''
			};
			highlightFiles = [null];
			await invalidateAll();
		} catch (err) {
			error = err.message || 'Failed to create tour';
		} finally {
			loading = false;
		}
	}

	function addHighlight() {
		highlightFiles = [...highlightFiles, null];
	}

	function removeHighlight(index) {
		highlightFiles = highlightFiles.filter((_, i) => i !== index);
	}

	function handleFileSelect(e, index) {
		const file = e.target.files?.[0];
		if (file) {
			highlightFiles[index] = file;
		}
	}

	const isOwnProfile = $user?.user_id === data.provider.user_id;

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	function formatPrice(price) {
		if (!price && price !== 0) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'TJS'
		}).format(price);
	}

	function getTourImageSrc(tour) {
		if (tour.highlights && tour.highlights.length > 0 && tour.highlights[0].image_url) {
			const url = tour.highlights[0].image_url;
			if (url.startsWith('http')) return url;
			return API_BASE + url;
		}
		const destUrl = tour.destination_image_url;
		if (destUrl) {
			if (destUrl.startsWith('http')) return destUrl;
			return API_BASE + destUrl;
		}
		return null;
	}

	function isTourExpired(tour) {
		if (!tour.end_date) return false;
		return new Date(tour.end_date) < new Date();
	}

	function openRenewDrawer(tour) {
		selectedTour = tour;
		renewForm.start_date = '';
		renewForm.end_date = '';
		renewError = '';
		renewDrawerOpen = true;
	}

	async function handleRenew(e) {
		e.preventDefault();
		renewLoading = true;
		renewError = '';
		try {
			await api.tours.renew(selectedTour.id, {
				start_date: new Date(renewForm.start_date).toISOString(),
				end_date: new Date(renewForm.end_date).toISOString()
			});
			renewDrawerOpen = false;
			await invalidateAll();
		} catch (err) {
			renewError = err.message || 'Failed to renew tour';
		} finally {
			renewLoading = false;
		}
	}
</script>

<svelte:head><title>{data.provider.user_name} | Tour Provider</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<a
				href="/providers"
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
				Back to Providers
			</a>
		</div>
		{#if isOwnProfile}
			<button
				onclick={() => (drawerOpen = true)}
				class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14" />
				</svg>
				Create Tour
			</button>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex flex-col items-center text-center">
					{#if data.provider.user_avatar_url}
						<img
							src={data.provider.user_avatar_url}
							alt={data.provider.user_name}
							class="h-32 w-32 rounded-full object-cover"
						/>
					{:else}
						<div
							class="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary"
						>
							{data.provider.user_name?.charAt(0) || 'P'}
						</div>
					{/if}
					<h1 class="mt-4 font-heading text-2xl font-bold">{data.provider.user_name}</h1>
					<span
						class="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize"
					>
						{data.provider.provider_type}
					</span>

					{#if data.provider.years_experience > 0}
						<p class="mt-4 text-sm text-muted-foreground">
							{data.provider.years_experience} years of experience
						</p>
					{/if}

					{#if data.provider.bio}
						<p class="mt-4 text-sm text-muted-foreground">{data.provider.bio}</p>
					{/if}

					<div class="mt-6 flex gap-3">
						{#if data.provider.instagram_url}
							<a
								href={data.provider.instagram_url}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
									/>
								</svg>
							</a>
						{/if}
						{#if data.provider.telegram_url}
							<a
								href={data.provider.telegram_url}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
									/>
								</svg>
							</a>
						{/if}
						{#if data.provider.facebook_url}
							<a
								href={data.provider.facebook_url}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full bg-muted p-3 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
							>
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
									/>
								</svg>
							</a>
						{/if}
					</div>

					<div class="mt-6 w-full border-t pt-4">
						<div class="flex items-center gap-2 text-sm">
							<svg
								class="h-4 w-4 text-muted-foreground"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/>
							</svg>
							<span class="text-muted-foreground">{data.provider.phone}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="lg:col-span-2">
			<h2 class="mb-6 font-heading text-xl font-semibold">Tours by {data.provider.user_name}</h2>

			{#if data.tours && data.tours.length > 0}
				<div class="space-y-4">
					{#each data.tours as tour}
						<a
							href="/tours/{tour.id}"
							class="flex gap-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
						>
							<div class="h-24 w-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
								{#if tour.highlights && tour.highlights.length > 0 && tour.highlights[0].image_url}
									<img
										src={getTourImageSrc(tour)}
										alt={tour.name}
										class="h-full w-full object-cover"
									/>
								{:else if tour.destination_image_url}
									<img
										src={tour.destination_image_url.startsWith('http')
											? tour.destination_image_url
											: API_BASE + tour.destination_image_url}
										alt={tour.name}
										class="h-full w-full object-cover"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center">
										<svg
											class="h-8 w-8 text-muted-foreground/50"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
											<circle cx="12" cy="10" r="3" />
										</svg>
									</div>
								{/if}
							</div>
							<div class="flex flex-1 flex-col justify-between">
								<div>
									<h3 class="font-semibold">{tour.name}</h3>
									<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
										{tour.description}
									</p>
								</div>
								<div class="mt-2 flex items-center justify-between">
									<div class="flex items-center gap-4 text-sm text-muted-foreground">
										<span class="flex items-center gap-1">
											<svg
												class="h-4 w-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M8 2v4M16 2v4M3 10h18M4 10h.01M20 10h.01" />
											</svg>
											{formatDate(tour.start_date)} - {formatDate(tour.end_date)}
										</span>
										<span class="flex items-center gap-1">
											<svg
												class="h-4 w-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
												<circle cx="9" cy="7" r="4" />
											</svg>
											{tour.capacity} spots
										</span>
									</div>
									<div class="flex items-center gap-2">
										{#if isTourExpired(tour)}
											<button
												class="text-sm font-medium text-primary hover:underline"
												onclick={(e) => {
													e.preventDefault();
													openRenewDrawer(tour);
												}}
											>
												Renew
											</button>
										{/if}
										<span class="font-semibold text-primary">{formatPrice(tour.price)}</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="rounded-lg border border-dashed p-8 text-center">
					<svg
						class="mx-auto mb-4 h-12 w-12 text-muted-foreground/50"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
						<circle cx="12" cy="10" r="3" />
					</svg>
					<p class="text-muted-foreground">No tours available from this provider yet.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<Drawer bind:open={drawerOpen} title="Create Tour">
	<form onsubmit={handleSubmit} class="space-y-4">
		{#if error}
			<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
		{/if}

		<div>
			<label for="name" class="block text-sm font-medium">Tour Name</label>
			<input
				type="text"
				id="name"
				bind:value={form.name}
				required
				class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium">Description</label>
			<textarea
				id="description"
				bind:value={form.description}
				rows="3"
				class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			></textarea>
		</div>

		<div>
			<label for="destination_id" class="block text-sm font-medium">Destination</label>
			<select
				id="destination_id"
				bind:value={form.destination_id}
				required
				class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			>
				<option value="">Select destination</option>
				{#each data.destinations as dest}
					<option value={dest.id}>{dest.name}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="start_date" class="block text-sm font-medium">Start Date</label>
				<input
					type="date"
					id="start_date"
					bind:value={form.start_date}
					required
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
			<div>
				<label for="end_date" class="block text-sm font-medium">End Date</label>
				<input
					type="date"
					id="end_date"
					bind:value={form.end_date}
					required
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="price" class="block text-sm font-medium">Price (TJS)</label>
				<input
					type="number"
					id="price"
					bind:value={form.price}
					required
					min="0"
					step="0.01"
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
			<div>
				<label for="capacity" class="block text-sm font-medium">Capacity</label>
				<input
					type="number"
					id="capacity"
					bind:value={form.capacity}
					required
					min="1"
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
		</div>

		<div>
			<div class="mb-2 flex items-center justify-between">
				<label class="block text-sm font-medium">Highlights</label>
				<button type="button" onclick={addHighlight} class="text-sm text-primary hover:underline">
					+ Add Highlight
				</button>
			</div>
			<div class="space-y-3">
				{#each highlightFiles as _, index}
					<div class="flex flex-col gap-2">
						<input
							type="file"
							accept="image/*"
							onchange={(e) => handleFileSelect(e, index)}
							class="rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary"
						/>
						{#if highlightFiles.length > 1}
							<button
								type="button"
								onclick={() => removeHighlight(index)}
								class="text-sm text-destructive hover:underline"
							>
								Remove
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
		>
			{loading ? 'Creating...' : 'Create Tour'}
		</button>
	</form>
</Drawer>

<Drawer bind:open={renewDrawerOpen} title="Renew Tour">
	<form onsubmit={handleRenew} class="space-y-4">
		{#if renewError}
			<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{renewError}</div>
		{/if}

		<p class="text-sm text-muted-foreground">
			Renew <span class="font-medium text-foreground">{selectedTour?.name}</span> with new dates.
		</p>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="renew_start_date" class="block text-sm font-medium">Start Date</label>
				<input
					type="date"
					id="renew_start_date"
					bind:value={renewForm.start_date}
					required
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
			<div>
				<label for="renew_end_date" class="block text-sm font-medium">End Date</label>
				<input
					type="date"
					id="renew_end_date"
					bind:value={renewForm.end_date}
					required
					class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
				/>
			</div>
		</div>

		<button
			type="submit"
			disabled={renewLoading}
			class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
		>
			{renewLoading ? 'Renewing...' : 'Renew Tour'}
		</button>
	</form>
</Drawer>
