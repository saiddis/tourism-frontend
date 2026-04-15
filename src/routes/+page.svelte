<script>
	let { data } = $props();

	const featuredDestinations = $derived(data.destinations?.slice(0, 4) || []);
	const featuredTours = $derived(data.tours?.slice(0, 6) || []);

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
</script>

<div>
	<!-- Hero Section -->
	<section class="relative min-h-[600px] overflow-hidden">
		<div class="absolute inset-0">
			<img
				src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop"
				alt="Beautiful tropical beach destination"
				class="h-full w-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
		</div>
		<div class="relative container mx-auto px-4 py-20 md:py-32">
			<div class="max-w-3xl">
				<h1 class="mb-6 font-heading text-4xl font-bold tracking-tight text-white md:text-6xl">
					Discover Your Next
					<span class="block text-primary">Extraordinary Journey</span>
				</h1>
				<p class="mb-8 max-w-xl text-lg text-white/80 md:text-xl">
					Explore breathtaking destinations, book curated tours, and create unforgettable memories
					with The Curated Horizon.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<a
						href="/tours"
						class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Explore Tours
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
					<a
						href="/destinations"
						class="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					>
						Browse Destinations
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="border-b bg-muted/30 py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="relative overflow-hidden rounded-xl p-6 text-center">
					<img
						src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop"
						alt="Curated destinations"
						class="absolute inset-0 h-full w-full object-cover"
					/>
					<div class="absolute inset-0 bg-black/60"></div>
					<div class="relative">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
						>
							<svg
								class="h-6 w-6 text-white"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<path d="M2 12h20M12 2a14.14 14.14 0 0 1 0 20 14.14 14.14 0 0 1 0-20" />
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-white">Curated Destinations</h3>
						<p class="text-sm text-white/80">
							Hand-picked locations that offer unique and memorable experiences.
						</p>
					</div>
				</div>
				<div class="relative overflow-hidden rounded-xl p-6 text-center">
					<img
						src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
						alt="Expert planning"
						class="absolute inset-0 h-full w-full object-cover"
					/>
					<div class="absolute inset-0 bg-black/60"></div>
					<div class="relative">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
						>
							<svg
								class="h-6 w-6 text-white"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="m3 16 4 4 4-4M7 20V4M17 20V4M21 12l-3-3-3 3M3 12l3-3 3 3M21 12l-2.5-2.5M3 12l2.5-2.5M20.5 9.5 17 6M3.5 9.5 7 6M20.5 14.5 17 18M3.5 14.5 7 18"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-white">Expert Planning</h3>
						<p class="text-sm text-white/80">
							Every detail of your journey is thoughtfully arranged.
						</p>
					</div>
				</div>
				<div class="relative overflow-hidden rounded-xl p-6 text-center">
					<img
						src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop"
						alt="Seamless experience"
						class="absolute inset-0 h-full w-full object-cover"
					/>
					<div class="absolute inset-0 bg-black/60"></div>
					<div class="relative">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
						>
							<svg
								class="h-6 w-6 text-white"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M20 8V6c0-2.5-2-4.5-4.5-4.5S11 3.5 11 6v2M17 6c0-2.5-2-4.5-4.5-4.5S8 3.5 8 6v2M4 10v8c0 2.5 2 4.5 4.5 4.5h7c2.5 0 4.5-2 4.5-4.5V10"
								/>
								<path d="M4 10V8c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5v2" />
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-white">Seamless Experience</h3>
						<p class="text-sm text-white/80">
							From booking to your return, enjoy a stress-free adventure.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Destinations -->
	{#if featuredDestinations.length > 0}
		<section class="py-16">
			<div class="container mx-auto px-4">
				<div class="mb-8 flex items-center justify-between">
					<div>
						<h2 class="font-heading text-2xl font-bold md:text-3xl">Featured Destinations</h2>
						<p class="mt-1 text-muted-foreground">Explore our most popular destinations</p>
					</div>
					<a
						href="/destinations"
						class="hidden text-sm font-medium text-primary hover:underline sm:block">View all →</a
					>
				</div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{#each featuredDestinations as destination}
						<a href="/tours?destination={destination.id}" class="group block">
							<div class="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
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
							<h3 class="font-semibold transition-colors group-hover:text-primary">
								{destination.name}
							</h3>
							<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
								{destination.description}
							</p>
						</a>
					{/each}
				</div>
				<a
					href="/destinations"
					class="mt-6 text-sm font-medium text-primary hover:underline sm:hidden"
					>View all destinations →</a
				>
			</div>
		</section>
	{/if}

	<!-- Featured Tours -->
	{#if featuredTours.length > 0}
		<section class="bg-muted/30 py-16">
			<div class="container mx-auto px-4">
				<div class="mb-8 flex items-center justify-between">
					<div>
						<h2 class="font-heading text-2xl font-bold md:text-3xl">Popular Tours</h2>
						<p class="mt-1 text-muted-foreground">Discover our most sought-after experiences</p>
					</div>
					<a href="/tours" class="hidden text-sm font-medium text-primary hover:underline sm:block"
						>View all →</a
					>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each featuredTours as tour}
						<a
							href="/tours/{tour.id}"
							class="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
						>
							<div class="relative aspect-video bg-muted">
								<div
									class="absolute top-3 right-3 rounded bg-primary px-2 py-1 text-sm font-medium text-primary-foreground"
								>
									{formatPrice(tour.price)}
								</div>
							</div>
							<div class="p-4">
								<h3 class="text-lg font-semibold transition-colors group-hover:text-primary">
									{tour.name}
								</h3>
								<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{tour.description}</p>
								<div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
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
											<path
												d="M8 2v4M16 2v4M3 10h18M4 10h.01M20 10h.01M5 4h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
											/>
										</svg>
										{formatDate(tour.start_date)}
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
											<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
										</svg>
										{tour.capacity} spots
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
				<a href="/tours" class="mt-6 text-sm font-medium text-primary hover:underline sm:hidden"
					>View all tours →</a
				>
			</div>
		</section>
	{/if}

	<!-- Empty States -->
	<!-- {#if featuredDestinations.length === 0 && featuredTours.length === 0} -->
	<!-- 	<section class="py-20"> -->
	<!-- 		<div class="container mx-auto px-4 text-center"> -->
	<!-- 			<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted"> -->
	<!-- 				<svg -->
	<!-- 					class="h-8 w-8 text-muted-foreground" -->
	<!-- 					viewBox="0 0 24 24" -->
	<!-- 					fill="none" -->
	<!-- 					stroke="currentColor" -->
	<!-- 					stroke-width="2" -->
	<!-- 					stroke-linecap="round" -->
	<!-- 					stroke-linejoin="round" -->
	<!-- 				> -->
	<!-- 					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /> -->
	<!-- 					<circle cx="12" cy="10" r="3" /> -->
	<!-- 				</svg> -->
	<!-- 			</div> -->
	<!-- 			<h2 class="mb-2 font-heading text-2xl font-bold">Start Your Journey</h2> -->
	<!-- 			<p class="mx-auto mb-6 max-w-md text-muted-foreground"> -->
	<!-- 				Our platform is ready to help you discover amazing destinations and book unforgettable -->
	<!-- 				tours. -->
	<!-- 			</p> -->
	<!-- 			<a -->
	<!-- 				href="/register" -->
	<!-- 				class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90" -->
	<!-- 			> -->
	<!-- 				Create an Account -->
	<!-- 				<svg -->
	<!-- 					class="h-4 w-4" -->
	<!-- 					viewBox="0 0 24 24" -->
	<!-- 					fill="none" -->
	<!-- 					stroke="currentColor" -->
	<!-- 					stroke-width="2" -->
	<!-- 					stroke-linecap="round" -->
	<!-- 					stroke-linejoin="round" -->
	<!-- 				> -->
	<!-- 					<path d="M5 12h14M12 5l7 7-7 7" /> -->
	<!-- 				</svg> -->
	<!-- 			</a> -->
	<!-- 		</div> -->
	<!-- 	</section> -->
	<!-- {/if} -->

	<!-- CTA Section -->
	{#if !data.user}
		<section class="bg-primary py-16 text-primary-foreground">
			<div class="container mx-auto px-4 text-center">
				<h2 class="mb-4 font-heading text-2xl font-bold md:text-3xl">Ready to Explore?</h2>
				<p class="mx-auto mb-6 max-w-xl text-primary-foreground/80">
					Join thousands of travelers who have discovered their dream destinations with The Curated
					Horizon.
				</p>
				<a
					href="/register"
					class="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-background/90"
				>
					Get Started
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
			</div>
		</section>
	{/if}
</div>
