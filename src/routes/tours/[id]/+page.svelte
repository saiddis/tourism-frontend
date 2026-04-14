<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { api, getStoredUser } from '$lib/api/client.js';

	let { data } = $props();

	let booking = $state({ loading: false, error: null, success: false });
	let review = $state({ rating: 5, comment: '', loading: false, error: null, success: false });
	let showReviewForm = $state(false);

	const user = $derived(getStoredUser());

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatShortDate(dateStr) {
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
			currency: 'USD'
		}).format(price);
	}

	function getDayCount() {
		if (!data.tour?.start_date || !data.tour?.end_date) return 0;
		const start = new Date(data.tour.start_date);
		const end = new Date(data.tour.end_date);
		return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
	}

	async function handleBooking() {
		booking.loading = true;
		booking.error = null;
		try {
			await api.bookings.create(data.tour.id);
			booking.success = true;
			goto('/bookings');
		} catch (err) {
			booking.error = err.message || 'Failed to create booking. Please try again.';
		} finally {
			booking.loading = false;
		}
	}

	async function handleReview() {
		review.loading = true;
		review.error = null;
		try {
			await api.reviews.create({
				tour_id: data.tour.id,
				rating: review.rating,
				comment: review.comment
			});
			review.success = true;
			review.comment = '';
			review.rating = 5;
			showReviewForm = false;
			await invalidateAll();
		} catch (err) {
			review.error = err.message || 'Failed to submit review. Please try again.';
		} finally {
			review.loading = false;
		}
	}

	function renderStars(rating) {
		return Array(5)
			.fill(0)
			.map((_, i) => i < rating);
	}
</script>

<svelte:head><title>{data.tour?.name || 'Tour'} | The Curated Horizon</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<div class="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
		<a href="/tours" class="hover:text-foreground">Tours</a>
		<span>/</span>
		{#if data.destination}
			<a href="/tours?destination={data.destination.id}" class="hover:text-foreground"
				>{data.destination.name}</a
			>
			<span>/</span>
		{/if}
		<span class="text-foreground">{data.tour?.name}</span>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="space-y-8 lg:col-span-2">
			<!-- Tour Header -->
			<div>
				<h1 class="mb-4 font-heading text-3xl font-bold md:text-4xl">{data.tour?.name}</h1>
				{#if data.destination}
					<a
						href="/tours?destination={data.destination.id}"
						class="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
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
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						{data.destination.name}
					</a>
				{/if}
			</div>

			<!-- Tour Image -->
			<div
				class="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"
			>
				{#if data.destination?.image_url}
					<img
						src={data.destination.image_url}
						alt={data.tour?.name}
						class="h-full w-full object-cover"
					/>
				{:else}
					<svg
						class="h-24 w-24 text-muted-foreground/30"
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
				{/if}
			</div>

			<!-- Tour Details -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 font-heading text-xl font-semibold">About This Tour</h2>
				<p class="leading-relaxed whitespace-pre-wrap text-muted-foreground">
					{data.tour?.description}
				</p>
			</div>

			<!-- Tour Info -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 font-heading text-xl font-semibold">Tour Details</h2>
				<div class="grid grid-cols-2 gap-6">
					<div class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-5 w-5 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M8 2v4M16 2v4M3 10h18M4 10h.01M20 10h.01M5 4h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
							/>
						</svg>
						<div>
							<p class="font-medium">Dates</p>
							<p class="text-sm text-muted-foreground">
								{formatShortDate(data.tour?.start_date)} - {formatShortDate(data.tour?.end_date)}
							</p>
							<p class="text-sm text-muted-foreground">{getDayCount()} days</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-5 w-5 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
						<div>
							<p class="font-medium">Capacity</p>
							<p class="text-sm text-muted-foreground">{data.tour?.capacity} travelers max</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-5 w-5 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 6v6l4 2" />
						</svg>
						<div>
							<p class="font-medium">Schedule</p>
							<p class="text-sm text-muted-foreground">Full day experience</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-5 w-5 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
						<div>
							<p class="font-medium">Price</p>
							<p class="text-sm text-muted-foreground">
								{formatPrice(data.tour?.price)} per person
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Reviews Section -->
			<div>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="font-heading text-xl font-semibold">Reviews</h2>
					{#if user}
						<button
							onclick={() => (showReviewForm = !showReviewForm)}
							class="text-sm font-medium text-primary hover:underline"
						>
							{showReviewForm ? 'Cancel' : 'Write a Review'}
						</button>
					{/if}
				</div>

				{#if showReviewForm && user}
					<div class="mb-6 rounded-lg border bg-card p-6">
						<h3 class="mb-4 font-medium">Share Your Experience</h3>
						{#if review.error}
							<div
								class="mb-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
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
									<circle cx="12" cy="12" r="10" />
									<path d="M12 8v4M12 16h.01" />
								</svg>
								{review.error}
							</div>
						{/if}
						{#if review.success}
							<div
								class="mb-4 flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600"
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
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
									<path d="M22 4L12 14.01l-3-3" />
								</svg>
								Review submitted successfully!
							</div>
						{/if}
						<form
							onsubmit={(e) => {
								e.preventDefault();
								handleReview();
							}}
							class="space-y-4"
						>
							<div>
								<label class="mb-2 block text-sm font-medium">Rating</label>
								<div class="flex gap-2">
									{#each [1, 2, 3, 4, 5] as rating}
										<button
											type="button"
											onclick={() => (review.rating = rating)}
											class="p-1 transition-transform hover:scale-110"
										>
											{#if rating <= review.rating}
												<svg
													class="h-6 w-6 fill-primary text-primary"
													viewBox="0 0 24 24"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<polygon
														points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
													/>
												</svg>
											{:else}
												<svg
													class="h-6 w-6 text-muted-foreground"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<polygon
														points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
													/>
												</svg>
											{/if}
										</button>
									{/each}
								</div>
							</div>
							<div>
								<label for="comment" class="mb-2 block text-sm font-medium">Your Review</label>
								<textarea
									id="comment"
									bind:value={review.comment}
									rows="4"
									class="w-full rounded-md border bg-background px-3 py-2 text-sm"
									placeholder="Share your experience..."
									required
								></textarea>
							</div>
							<button
								type="submit"
								disabled={review.loading}
								class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
							>
								{#if review.loading}
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
								Submit Review
							</button>
						</form>
					</div>
				{/if}

				{#if data.reviews && data.reviews.length > 0}
					<div class="space-y-4">
						{#each data.reviews as r}
							<div class="rounded-lg border bg-card p-4">
								<div class="mb-2 flex items-center gap-2">
									<div class="flex">
										{#each renderStars(r.rating) as filled}
											{#if filled}
												<svg
													class="h-4 w-4 fill-primary text-primary"
													viewBox="0 0 24 24"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<polygon
														points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
													/>
												</svg>
											{:else}
												<svg
													class="h-4 w-4 text-muted-foreground"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<polygon
														points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
													/>
												</svg>
											{/if}
										{/each}
									</div>
									<span class="text-sm text-muted-foreground">{formatDate(r.created_at)}</span>
								</div>
								<p class="text-sm">{r.comment}</p>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-lg bg-muted/30 py-8 text-center">
						<svg
							class="mx-auto mb-2 h-8 w-8 text-muted-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polygon
								points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
							/>
						</svg>
						<p class="text-muted-foreground">
							No reviews yet. Be the first to share your experience!
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar / Booking -->
		<div class="lg:col-span-1">
			<div class="sticky top-24">
				<div class="rounded-lg border bg-card p-6">
					<div class="mb-4">
						<span class="text-3xl font-bold">{formatPrice(data.tour?.price)}</span>
						<span class="text-muted-foreground"> / person</span>
					</div>

					<div class="mb-6 space-y-3 text-sm">
						<div class="flex items-center gap-2">
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
									d="M8 2v4M16 2v4M3 10h18M4 10h.01M20 10h.01M5 4h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
								/>
							</svg>
							<span
								>{formatShortDate(data.tour?.start_date)} - {formatShortDate(
									data.tour?.end_date
								)}</span
							>
						</div>
						<div class="flex items-center gap-2">
							<svg
								class="h-4 w-4 text-muted-foreground"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>{data.tour?.capacity} spots available</span>
						</div>
					</div>

					{#if booking.error}
						<div
							class="mb-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
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
								<circle cx="12" cy="12" r="10" />
								<path d="M12 8v4M12 16h.01" />
							</svg>
							{booking.error}
						</div>
					{/if}

					{#if user}
						<button
							onclick={handleBooking}
							disabled={booking.loading}
							class="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
						>
							{#if booking.loading}
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
							{booking.loading ? 'Booking...' : 'Book This Tour'}
						</button>
						<p class="mt-3 text-center text-xs text-muted-foreground">
							No payment required at booking. You'll be redirected to complete your booking.
						</p>
					{:else}
						<a
							href="/login"
							class="block w-full rounded-md bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Login to Book
						</a>
						<p class="mt-3 text-center text-xs text-muted-foreground">
							Don't have an account? <a href="/register" class="text-primary hover:underline"
								>Register</a
							>
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
