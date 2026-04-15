<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();

	const isAuthenticated = $derived(data?.user != null);
	const currentPath = $derived($page.url.pathname);

	async function handleLogout() {
		try {
			await api.auth.logout();
		} catch {
			// Local auth state is already cleared in the client even if the network request fails.
		}

		await invalidateAll();

		if (typeof window !== 'undefined') {
			window.location.replace('/');
			return;
		}

		goto('/', { replaceState: true });
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col">
	<header
		class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto px-4">
			<nav class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a href="/" class="flex items-center gap-2 font-heading text-xl font-bold">
						<svg
							class="h-8 w-8 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
							<path d="M2 12h20" />
						</svg>
						<span class="hidden sm:inline">The Curated Horizon</span>
					</a>
					<div class="hidden items-center gap-6 md:flex">
						<a
							href="/destinations"
							class="text-sm font-medium transition-colors hover:text-primary {currentPath ===
							'/destinations'
								? 'text-primary'
								: ''}">Destinations</a
						>
						<a
							href="/tours"
							class="text-sm font-medium transition-colors hover:text-primary {currentPath ===
							'/tours'
								? 'text-primary'
								: ''}">Tours</a
						>
						{#if isAuthenticated}
							<a
								href="/bookings"
								class="text-sm font-medium transition-colors hover:text-primary {currentPath ===
								'/bookings'
									? 'text-primary'
									: ''}">My Bookings</a
							>
						{/if}
					</div>
				</div>
				<div class="flex items-center gap-4">
					{#if isAuthenticated}
						<div class="flex items-center gap-4">
							<span class="hidden text-sm text-muted-foreground sm:inline"
								>Hi, {data.user?.name || 'Traveler'}</span
							>
							<button
								onclick={handleLogout}
								type="button"
								class="text-sm font-medium transition-colors hover:text-primary">Logout</button
							>
						</div>
					{:else}
						<a href="/login" class="text-sm font-medium transition-colors hover:text-primary"
							>Login</a
						>
						<a
							href="/register"
							class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>Register</a
						>
					{/if}
				</div>
			</nav>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t bg-muted/50">
		<div class="container mx-auto px-4 py-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<div class="col-span-1 md:col-span-2">
					<div class="mb-4 flex items-center gap-2 font-heading text-lg font-bold">
						<svg
							class="h-6 w-6 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
							<path d="M2 12h20" />
						</svg>
						The Curated Horizon
					</div>
					<p class="max-w-md text-sm text-muted-foreground">
						Discover extraordinary destinations and create unforgettable travel memories with our
						carefully curated tours.
					</p>
				</div>
				<div>
					<h3 class="mb-4 font-semibold">Explore</h3>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li>
							<a href="/destinations" class="transition-colors hover:text-foreground"
								>Destinations</a
							>
						</li>
						<li><a href="/tours" class="transition-colors hover:text-foreground">Tours</a></li>
						<li>
							<a href="/bookings" class="transition-colors hover:text-foreground">My Bookings</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-semibold">Account</h3>
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li><a href="/login" class="transition-colors hover:text-foreground">Login</a></li>
						<li>
							<a href="/register" class="transition-colors hover:text-foreground">Register</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
				<p>© 2026 The Curated Horizon. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>
