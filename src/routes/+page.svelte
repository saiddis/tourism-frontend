<script>
	let { data } = $props();

	const featuredDestinations = $derived(data.destinations?.slice(0, 4) || []);
	const featuredTours = $derived(data.tours?.slice(0, 3) || []);
	const travelGallery = [
		'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
		'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80'
	];

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

	function getDestinationImage(destination, index) {
		return destination?.image_url || travelGallery[index % travelGallery.length];
	}

	function getTourImage(index) {
		return travelGallery[(index + 3) % travelGallery.length];
	}
</script>

<svelte:head><title>Horizon | Curated Travel Experiences</title></svelte:head>

<div class="overflow-x-hidden">
	<section class="relative overflow-hidden border-b bg-[#f7f1e8] text-slate-950">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(203,213,225,0.65),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.22),transparent_35%)]"
		></div>
		<div class="relative container mx-auto px-4 py-10 md:py-16">
			<div class="grid items-center gap-10 lg:grid-cols-[1.15fr_0.95fr]">
				<div class="max-w-2xl">
					<div
						class="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-slate-700 uppercase"
					>
						Horizon
						<span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
						Curated Routes
					</div>
					<h1
						class="max-w-3xl font-heading text-5xl leading-none font-bold tracking-tight md:text-7xl"
					>
						Travel that looks
						<span class="block text-[#c26a2e]">cinematic before you even leave.</span>
					</h1>
					<p class="mt-6 max-w-xl text-base leading-7 text-slate-700 md:text-lg">
						Horizon pairs striking destinations with ready-to-book itineraries, small-group energy,
						and a visual-first approach to planning your next escape.
					</p>
					<div class="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							href="/tours"
							class="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
						>
							Explore tours
						</a>
						<a
							href="/destinations"
							class="inline-flex items-center justify-center rounded-full border border-slate-950/15 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
						>
							Browse destinations
						</a>
					</div>
					<div class="mt-10 grid gap-4 sm:grid-cols-3">
						<div class="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
							<p class="text-3xl font-bold">{data.destinations?.length || 0}</p>
							<p class="mt-1 text-sm text-slate-600">Destinations staged for discovery</p>
						</div>
						<div class="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
							<p class="text-3xl font-bold">{data.tours?.length || 0}</p>
							<p class="mt-1 text-sm text-slate-600">Bookable itineraries</p>
						</div>
						<div class="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
							<p class="text-3xl font-bold">24/7</p>
							<p class="mt-1 text-sm text-slate-600">Dream-trip browsing energy</p>
						</div>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
					<div
						class="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-slate-200 shadow-2xl shadow-amber-950/15"
					>
						<img
							src={travelGallery[0]}
							alt="Golden beach destination from Unsplash"
							class="h-full w-full object-cover"
						/>
						<div
							class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 text-white"
						>
							<p class="text-xs font-semibold tracking-[0.28em] text-white/75 uppercase">
								Featured Mood
							</p>
							<h2 class="mt-2 text-2xl font-semibold">
								Sunrise coastlines, hidden coves, slow dinners.
							</h2>
						</div>
					</div>
					<div class="grid gap-4">
						<div class="relative overflow-hidden rounded-[2rem] bg-slate-200 shadow-xl">
							<img
								src={travelGallery[1]}
								alt="Mountain road journey from Unsplash"
								class="h-56 w-full object-cover"
							/>
							<div
								class="absolute right-4 bottom-4 rounded-2xl bg-white/85 px-4 py-3 text-right backdrop-blur"
							>
								<p class="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
									Style
								</p>
								<p class="mt-1 text-lg font-semibold">Road stories</p>
							</div>
						</div>
						<div class="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
							<p class="text-xs font-semibold tracking-[0.24em] text-white/60 uppercase">Promise</p>
							<p class="mt-3 text-2xl font-semibold">Plan less. Feel more when the trip starts.</p>
							<p class="mt-3 text-sm leading-6 text-white/70">
								Editorial inspiration up front, practical booking flow underneath.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section
		class="border-b bg-slate-950 py-4 text-[11px] font-semibold tracking-[0.28em] text-white/70 uppercase"
	>
		<div
			class="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center"
		>
			<span>Ocean mornings</span>
			<span>City-after-dark itineraries</span>
			<span>Mountain air resets</span>
			<span>Small-group departures</span>
			<span>Photo-ready stays</span>
		</div>
	</section>

	<section class="bg-white py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div class="max-w-2xl">
					<p class="text-sm font-semibold tracking-[0.28em] text-[#c26a2e] uppercase">
						Signature Escapes
					</p>
					<h2 class="mt-3 font-heading text-3xl font-bold tracking-tight md:text-5xl">
						The places people bookmark, send to friends, and actually book.
					</h2>
				</div>
				<a
					href="/destinations"
					class="text-sm font-semibold text-slate-900 transition hover:text-[#c26a2e]"
				>
					View all destinations
				</a>
			</div>

			{#if featuredDestinations.length > 0}
				<div class="grid gap-6 lg:grid-cols-4">
					{#each featuredDestinations as destination, index}
						<a
							href="/tours?destination={destination.id}"
							class="group relative overflow-hidden rounded-[2rem] bg-slate-200 text-white shadow-xl shadow-slate-950/10"
						>
							<img
								src={getDestinationImage(destination, index)}
								alt={destination.name}
								class="h-[26rem] w-full object-cover transition duration-500 group-hover:scale-105"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent"
							></div>
							<div class="absolute inset-x-0 bottom-0 p-6">
								<p class="text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">
									Destination
								</p>
								<h3 class="mt-2 text-2xl font-semibold">{destination.name}</h3>
								<p class="mt-3 line-clamp-3 text-sm leading-6 text-white/80">
									{destination.description}
								</p>
								<span class="mt-5 inline-flex items-center text-sm font-semibold text-white">
									See departures
								</span>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div
					class="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center"
				>
					<h3 class="text-2xl font-semibold text-slate-900">The map is waiting.</h3>
					<p class="mt-3 text-slate-600">
						Destinations will appear here as soon as the next collection is published.
					</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="bg-[#f5efe6] py-16 md:py-20">
		<div class="container mx-auto px-4">
			<div class="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
				<div>
					<p class="text-sm font-semibold tracking-[0.28em] text-[#c26a2e] uppercase">
						Next Departure
					</p>
					<h2
						class="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-950 md:text-5xl"
					>
						Trips designed to look good on the calendar and in the camera roll.
					</h2>
				</div>
				<p class="max-w-2xl self-end text-base leading-7 text-slate-700">
					Each itinerary keeps the details practical but the feeling elevated. Browse the current
					lineup, compare departure windows, and pick the pace that fits.
				</p>
			</div>

			{#if featuredTours.length > 0}
				<div class="grid gap-6 lg:grid-cols-3">
					{#each featuredTours as tour, index}
						<a
							href="/tours/{tour.id}"
							class="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-950/10 transition hover:-translate-y-1"
						>
							<div class="relative h-72 overflow-hidden bg-slate-200">
								<img
									src={getTourImage(index)}
									alt={tour.name}
									class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								/>
								<div
									class="absolute top-4 left-4 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-slate-900 backdrop-blur"
								>
									{formatPrice(tour.price)}
								</div>
							</div>
							<div class="space-y-4 p-6">
								<div>
									<p class="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
										Curated Tour
									</p>
									<h3 class="mt-2 text-2xl font-semibold text-slate-950">{tour.name}</h3>
								</div>
								<p class="line-clamp-3 text-sm leading-6 text-slate-600">{tour.description}</p>
								<div
									class="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600"
								>
									<span>{formatDate(tour.start_date)}</span>
									<span>{tour.capacity} spots</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="rounded-[2rem] bg-white p-10 text-center shadow-sm">
					<h3 class="text-2xl font-semibold text-slate-900">Fresh itineraries are on the way.</h3>
					<p class="mt-3 text-slate-600">
						Check back soon to see the first departures available through Horizon.
					</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="relative overflow-hidden bg-slate-950 py-16 text-white md:py-20">
		<img
			src={travelGallery[6]}
			alt="Dramatic valley view from Unsplash"
			class="absolute inset-0 h-full w-full object-cover opacity-30"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40"
		></div>
		<div
			class="relative container mx-auto grid gap-8 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
		>
			<div class="max-w-2xl">
				<p class="text-sm font-semibold tracking-[0.28em] text-amber-300 uppercase">
					Book The Mood
				</p>
				<h2 class="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
					Make the next trip feel inevitable.
				</h2>
				<p class="mt-5 max-w-xl text-base leading-7 text-white/75">
					Start with a destination, follow it into a tour, and let Horizon handle the transition
					from inspiration to itinerary.
				</p>
			</div>
			<div class="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
				<div class="grid gap-4 sm:grid-cols-2">
					<a
						href="/register"
						class="rounded-[1.5rem] bg-white px-5 py-4 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
					>
						Create an account
					</a>
					<a
						href="/tours"
						class="rounded-[1.5rem] border border-white/20 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
					>
						View tours
					</a>
				</div>
				<p class="mt-4 text-sm leading-6 text-white/65">
					Already have a destination in mind? Skip straight to departures and start planning.
				</p>
			</div>
		</div>
	</section>
</div>
