<script>
	let { data } = $props();
</script>

<svelte:head><title>Destinations | Horizon</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="font-heading text-3xl font-bold md:text-4xl">Destinations</h1>
		<p class="mt-2 text-muted-foreground">
			Explore our curated collection of breathtaking destinations
		</p>
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
			<p class="text-sm text-destructive">Unable to load destinations. Please try again later.</p>
		</div>
	{/if}

	{#if data.destinations && data.destinations.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.destinations as destination}
				<a
					href="/tours?destination={destination.id}"
					class="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
				>
					<div class="relative aspect-[4/3] overflow-hidden bg-muted">
						{#if destination.image_url}
							<img
								src={destination.image_url}
								alt={destination.name}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center">
								<svg
									class="h-12 w-12 text-muted-foreground/50"
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
					<div class="p-4">
						<h2 class="text-lg font-semibold transition-colors group-hover:text-primary">
							{destination.name}
						</h2>
						<p class="mt-2 line-clamp-3 text-sm text-muted-foreground">{destination.description}</p>
						<div class="mt-4 flex items-center text-sm font-medium text-primary">
							View tours
							<svg
								class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
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
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
					<circle cx="12" cy="10" r="3" />
				</svg>
			</div>
			<h2 class="mb-2 font-heading text-xl font-semibold">No Destinations Yet</h2>
			<p class="text-muted-foreground">Check back soon for exciting new destinations to explore.</p>
		</div>
	{/if}
</div>
