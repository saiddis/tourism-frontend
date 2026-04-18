<script>
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	let { data } = $props();

	let toggling = $state({});

	async function toggleActive(providerId, currentActive) {
		toggling[providerId] = true;
		try {
			await api.providers.toggleActive(providerId, !currentActive);
			await invalidateAll();
		} catch (err) {
			alert(err.message || 'Failed to update provider');
		} finally {
			toggling[providerId] = false;
		}
	}
</script>

<svelte:head><title>Manage Providers | Admin</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="font-heading text-3xl font-bold">Manage Providers</h1>
			<p class="mt-2 text-muted-foreground">View and manage tour providers</p>
		</div>
		<a
			href="/admin/provider-applications"
			class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="12" y1="18" x2="12" y2="12" />
				<line x1="9" y1="15" x2="15" y2="15" />
			</svg>
			View Applications
		</a>
	</div>

	{#if data.error}
		<div
			class="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{data.error}
		</div>
	{/if}

	{#if data.providers && data.providers.length > 0}
		<div class="overflow-hidden rounded-lg border">
			<table class="min-w-full divide-y divide-border">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium">Provider</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Type</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Contact</th>
						<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
						<th class="px-4 py-3 text-right text-sm font-medium">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border bg-card">
					{#each data.providers as provider}
						<tr>
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									{#if provider.user_avatar_url}
										<img
											src={provider.user_avatar_url}
											alt={provider.user_name}
											class="h-10 w-10 rounded-full object-cover"
										/>
									{:else}
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
										>
											{provider.user_name?.charAt(0) || 'P'}
										</div>
									{/if}
									<div>
										<p class="font-medium">{provider.user_name}</p>
										<p class="text-xs text-muted-foreground">{provider.user_email}</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3">
								<span
									class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize"
								>
									{provider.provider_type}
								</span>
							</td>
							<td class="px-4 py-3 text-sm">{provider.phone}</td>
							<td class="px-4 py-3">
								{#if provider.active}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600"
									>
										<svg class="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="4" />
										</svg>
										Active
									</span>
								{:else}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600"
									>
										<svg class="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
											<circle cx="12" cy="12" r="4" />
										</svg>
										Inactive
									</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-right">
								<button
									onclick={() => toggleActive(provider.id, provider.active)}
									disabled={toggling[provider.id]}
									class="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:opacity-50"
								>
									{toggling[provider.id]
										? 'Updating...'
										: provider.active
											? 'Deactivate'
											: 'Activate'}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="rounded-lg border border-dashed p-8 text-center">
			<p class="text-muted-foreground">No providers found.</p>
		</div>
	{/if}
</div>
