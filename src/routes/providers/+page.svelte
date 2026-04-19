<script>
	let { data } = $props();
</script>

<svelte:head><title>Tour Providers | Horizon</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<div>
			<h1 class="font-heading text-3xl font-bold md:text-4xl">Tour Providers</h1>
			<p class="mt-2 text-muted-foreground">
				Discover experienced tour providers offering unique experiences
			</p>
		</div>
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
			<p class="text-sm text-destructive">Unable to load providers. Please try again later.</p>
		</div>
	{/if}

	{#if data.providers && data.providers.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.providers as provider}
				<a
					href="/providers/{provider.id}"
					class="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
				>
					<div class="p-6">
						<div class="flex items-start gap-4">
							{#if provider.user_avatar_url}
								<img
									src={provider.user_avatar_url}
									alt={provider.user_name}
									class="h-16 w-16 rounded-full object-cover"
								/>
							{:else}
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary"
								>
									{provider.user_name?.charAt(0) || 'P'}
								</div>
							{/if}
							<div class="flex-1">
								<h2 class="text-lg font-semibold transition-colors group-hover:text-primary">
									{provider.user_name}
								</h2>
								<span
									class="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize"
								>
									{provider.provider_type}
								</span>
							</div>
						</div>

						{#if provider.bio}
							<p class="mt-4 line-clamp-3 text-sm text-muted-foreground">{provider.bio}</p>
						{/if}

						<div class="mt-4 flex flex-wrap gap-2">
							{#if provider.instagram_url}
								<a
									href={provider.instagram_url}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									class="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
										/>
									</svg>
								</a>
							{/if}
							{#if provider.telegram_url}
								<a
									href={provider.telegram_url}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									class="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
										/>
									</svg>
								</a>
							{/if}
							{#if provider.facebook_url}
								<a
									href={provider.facebook_url}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									class="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
										/>
									</svg>
								</a>
							{/if}
						</div>

						{#if provider.years_experience > 0}
							<p class="mt-4 text-sm text-muted-foreground">
								<span class="font-medium">{provider.years_experience}</span> years of experience
							</p>
						{/if}
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
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			</div>
			<h2 class="mb-2 font-heading text-xl font-semibold">No Providers Yet</h2>
			<p class="text-muted-foreground">Be the first to become a tour provider on our platform.</p>
		</div>
	{/if}
</div>
