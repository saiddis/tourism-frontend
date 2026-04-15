<script>
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	let { data } = $props();

	let payment = $state({ bookingId: null, amount: 0, loading: false, error: null, success: false });
	let showPaymentModal = $state(false);

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatPrice(price) {
		if (!price && price !== 0) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function getStatusBadge(status) {
		const styles = {
			pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
			confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
			cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
		};
		return styles[status] || styles.pending;
	}

	function openPaymentModal(booking) {
		payment.bookingId = booking.id;
		payment.amount = booking.tour_price || 0;
		payment.error = null;
		payment.success = false;
		showPaymentModal = true;
	}

	async function handlePayment() {
		payment.loading = true;
		payment.error = null;
		try {
			await api.payments.create(payment.bookingId, payment.amount);
			payment.success = true;
			await invalidateAll();
			setTimeout(() => {
				showPaymentModal = false;
				payment.success = false;
			}, 2000);
		} catch (err) {
			payment.error = err.message || 'Payment failed. Please try again.';
		} finally {
			payment.loading = false;
		}
	}

	async function cancelBooking(bookingId) {
		if (!confirm('Are you sure you want to cancel this booking?')) return;
		try {
			await api.bookings.updateStatus(bookingId, 'cancelled');
			await invalidateAll();
		} catch (err) {
			alert(err.message || 'Failed to cancel booking');
		}
	}
</script>

<svelte:head><title>My Bookings | The Curated Horizon</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="font-heading text-3xl font-bold md:text-4xl">My Bookings</h1>
		<p class="mt-2 text-muted-foreground">View and manage your tour bookings</p>
	</div>

	{#if data.error}
		<div
			class="mb-8 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
		>
			<svg
				class="h-5 w-5 flex-shrink-0 text-destructive"
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
			<p class="text-sm text-destructive">Unable to load bookings. Please try again later.</p>
		</div>
	{/if}

	{#if data.bookings && data.bookings.length > 0}
		<div class="space-y-6">
			{#each data.bookings as booking}
				<div class="overflow-hidden rounded-lg border bg-card">
					<div class="p-6">
						<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
							<div class="flex-1">
								<div class="flex items-start gap-4">
									<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
										{#if booking.destination_image_url}
											<img
												src={booking.destination_image_url}
												alt={booking.tour_name}
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
									<div>
										<h3 class="text-lg font-semibold">{booking.tour_name || 'Unknown Tour'}</h3>
										{#if booking.destination_name}
											<p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
												<svg
													class="h-3 w-3"
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
												{booking.destination_name}
											</p>
										{/if}
										{#if booking.tour_start_date || booking.tour_end_date}
											<p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
												<svg
													class="h-3 w-3"
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
												{formatDate(booking.tour_start_date)} - {formatDate(booking.tour_end_date)}
											</p>
										{/if}
									</div>
								</div>
							</div>
							<div class="flex flex-col items-end gap-2">
								<span
									class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getStatusBadge(
										booking.status
									)}"
								>
									{#if booking.status === 'pending'}
										<svg
											class="mr-1 h-3 w-3"
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
									{:else if booking.status === 'confirmed'}
										<svg
											class="mr-1 h-3 w-3"
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
									{:else if booking.status === 'cancelled'}
										<svg
											class="mr-1 h-3 w-3"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M18 6 6 18M6 6l12 12" />
										</svg>
									{/if}
									{booking.status}
								</span>
								<span class="font-semibold">{formatPrice(booking.tour_price)}</span>
							</div>
						</div>
					</div>
					{#if booking.status !== 'cancelled'}
						<div
							class="flex flex-wrap items-center justify-between gap-4 border-t bg-muted/30 px-6 py-4"
						>
							<div class="text-sm text-muted-foreground">
								Booked on {formatDate(booking.created_at)}
							</div>
							<div class="flex items-center gap-2">
								{#if booking.status === 'pending'}
									<button
										onclick={() => openPaymentModal(booking)}
										class="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
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
											<rect width="20" height="16" x="2" y="4" rx="2" />
											<path d="M2 10h20" />
										</svg>
										Make Payment
									</button>
								{/if}
								{#if booking.status === 'pending'}
									<button
										onclick={() => cancelBooking(booking.id)}
										class="text-sm font-medium text-destructive hover:underline"
									>
										Cancel Booking
									</button>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else if !data.error}
		<div class="py-20 text-center">
			<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<svg
					class="h-8 w-8 text-muted-foreground"
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
			</div>
			<h2 class="mb-2 font-heading text-xl font-semibold">No Bookings Yet</h2>
			<p class="mb-6 text-muted-foreground">
				Start exploring our tours and book your first adventure!
			</p>
			<a
				href="/tours"
				class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Browse Tours
			</a>
		</div>
	{/if}
</div>

{#if showPaymentModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg border bg-card p-6">
			<h2 class="mb-4 font-heading text-xl font-semibold">Complete Payment</h2>

			{#if payment.error}
				<div
					class="mb-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
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
					{payment.error}
				</div>
			{/if}

			{#if payment.success}
				<div
					class="mb-4 flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-600"
				>
					<svg
						class="h-5 w-5 flex-shrink-0"
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
					Payment submitted successfully!
				</div>
			{:else}
				<div class="space-y-4">
					<div>
						<p class="mb-1 text-sm text-muted-foreground">Amount</p>
						<p class="text-2xl font-bold">{formatPrice(payment.amount)}</p>
					</div>
					<p class="text-sm text-muted-foreground">
						This is a demo payment. In a real application, you would be redirected to a payment
						gateway.
					</p>
					<div class="flex gap-3">
						<button
							onclick={() => (showPaymentModal = false)}
							class="flex-1 rounded-md border py-2 font-medium transition-colors hover:bg-muted"
						>
							Cancel
						</button>
						<button
							onclick={handlePayment}
							disabled={payment.loading}
							class="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
						>
							{#if payment.loading}
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
							{payment.loading ? 'Processing...' : 'Confirm Payment'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
