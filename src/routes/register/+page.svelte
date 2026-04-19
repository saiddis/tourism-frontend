<script>
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name || !email || !password) {
			error = 'All fields are required';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await api.auth.register({ name, email, password });
			if (response?.access_token) {
				localStorage.setItem('access_token', response.access_token);
			}
			await invalidateAll();
			goto('/', { replaceState: true });
		} catch (err) {
			error = err.message || 'Registration failed. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Register | Horizon</title></svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
	<div class="w-full max-w-md px-4">
		<div class="mb-8 text-center">
			<h1 class="font-heading text-3xl font-bold">Create Your Account</h1>
			<p class="mt-2 text-muted-foreground">Join Horizon and start exploring</p>
		</div>

		<div class="rounded-lg border bg-card p-6">
			{#if error}
				<div
					class="mb-6 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
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

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="name" class="mb-2 block text-sm font-medium">Full Name</label>
					<div class="relative">
						<svg
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="w-full rounded-md border bg-background py-2 pr-4 pl-10 text-sm"
							placeholder="John Doe"
						/>
					</div>
				</div>

				<div>
					<label for="email" class="mb-2 block text-sm font-medium">Email</label>
					<div class="relative">
						<svg
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="w-full rounded-md border bg-background py-2 pr-4 pl-10 text-sm"
							placeholder="john@example.com"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium">Password</label>
					<div class="relative">
						<svg
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							minlength="6"
							class="w-full rounded-md border bg-background py-2 pr-4 pl-10 text-sm"
							placeholder="••••••••"
						/>
					</div>
					<p class="mt-1 text-xs text-muted-foreground">Must be at least 6 characters</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-primary py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
				>
					{loading ? 'Creating account...' : 'Create Account'}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-muted-foreground">
				Already have an account? <a href="/login" class="font-medium text-primary hover:underline"
					>Sign in</a
				>
			</p>
		</div>
	</div>
</div>
