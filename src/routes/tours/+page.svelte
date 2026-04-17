<script>
	let { data } = $props();

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
			currency: 'TJS'
		}).format(price);
	}
</script>

<svelte:head
	><title
		>{data.destination ? `Tours in ${data.destination.name}` : 'Tours'} | The Curated Horizon</title
	></svelte:head
>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		{#if data.destination}
			<div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
				<a href="/destinations" class="hover:text-foreground">Destinations</a>
				<span>/</span>
				<span>{data.destination.name}</span>
			</div>
			<h1 class="font-heading text-3xl font-bold md:text-4xl">Tours in {data.destination.name}</h1>
			<p class="mt-2 text-muted-foreground">Discover curated tours in this destination</p>
		{:else}
			<h1 class="font-heading text-3xl font-bold md:text-4xl">All Tours</h1>
			<p class="mt-2 text-muted-foreground">Explore our collection of curated travel experiences</p>
		{/if}
	</div>

	{#if data.error}
		<div
			class="mb-8 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4"
		>
			<p class="text-sm text-destructive">Unable to load tours. Please try again later.</p>
		</div>
	{/if}

	{#if data.tours && data.tours.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.tours as tour}
				<a
					href="/tours/{tour.id}"
					class="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
				>
					<div
						class="relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20"
					>
						{#if (data.destination && data.destination.image_url) || tour.destination_image_url}
							<img
								src={data.destination?.image_url || tour.destination_image_url}
								alt={tour.name}
								class="absolute inset-0 h-full w-full object-cover opacity-50"
							/>
						{/if}
						<div class="relative p-4 text-center">
							<h3 class="text-xl font-semibold transition-colors group-hover:text-primary">
								{tour.name}
							</h3>
						</div>
						<div
							class="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground"
						>
							{formatPrice(tour.price)}
						</div>
					</div>
					<div class="flex flex-1 flex-col p-4">
						<p class="line-clamp-3 flex-1 text-sm text-muted-foreground">{tour.description}</p>
						<div class="mt-4 space-y-2">
							<div class="flex items-center gap-2 text-sm text-muted-foreground">
								<svg
									class="h-4 w-4 flex-shrink-0"
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
								<span>{formatDate(tour.start_date)} - {formatDate(tour.end_date)}</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-muted-foreground">
								<svg
									class="h-4 w-4 flex-shrink-0"
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
								<span>{tour.capacity} travelers max</span>
							</div>
							{#if !data.destination}
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<svg
										class="h-4 w-4 flex-shrink-0"
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
									<span>{tour.destination_name || 'Unknown'}</span>
								</div>
							{/if}
						</div>
						<div class="mt-4 flex items-center justify-between border-t pt-4">
							<span class="text-sm font-medium text-primary">View details</span>
							<svg
								class="h-4 w-4 text-primary transition-transform group-hover:translate-x-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</div>
					</div>
				</a>
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
			<h2 class="mb-2 font-heading text-xl font-semibold">No Tours Available</h2>
			<p class="text-muted-foreground">
				{#if data.destination}
					No tours available in this destination yet. Check back soon!
				{:else}
					No tours available yet. Check back soon!
				{/if}
			</p>
			{#if data.destination}
				<a
					href="/tours"
					class="mt-4 inline-flex items-center gap-2 font-medium text-primary hover:underline"
				>
					View all tours
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</a>
			{/if}
		</div>
	{/if}
</div>
