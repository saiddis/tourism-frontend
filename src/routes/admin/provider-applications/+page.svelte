<script>
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';

	let { data } = $props();

	let processing = $state({});
	let showRejectModal = $state(false);
	let rejectingApp = $state(null);
	let rejectNote = $state('');

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function acceptApplication(app) {
		processing[app.id] = 'accept';
		try {
			await api.providerApplications.accept(app.id, '');
			await invalidateAll();
		} catch (err) {
			alert(err.message || 'Failed to accept application');
		} finally {
			processing[app.id] = null;
		}
	}

	function openRejectModal(app) {
		rejectingApp = app;
		rejectNote = '';
		showRejectModal = true;
	}

	function closeRejectModal() {
		showRejectModal = false;
		rejectingApp = null;
		rejectNote = '';
	}

	async function submitReject() {
		if (!rejectingApp) return;
		processing[rejectingApp.id] = 'reject';
		try {
			await api.providerApplications.reject(rejectingApp.id, rejectNote);
			await invalidateAll();
			closeRejectModal();
		} catch (err) {
			alert(err.message || 'Failed to reject application');
		} finally {
			processing[rejectingApp.id] = null;
		}
	}

	const pendingApps = $derived(data.applications?.filter((a) => a.status === 'pending') || []);
	const processedApps = $derived(data.applications?.filter((a) => a.status !== 'pending') || []);
</script>

<svelte:head><title>Provider Applications | Admin</title></svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="font-heading text-3xl font-bold">Provider Applications</h1>
			<p class="mt-2 text-muted-foreground">Review and manage provider applications</p>
		</div>
		<a
			href="/admin/providers"
			class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
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
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
			</svg>
			Manage Providers
		</a>
	</div>

	{#if data.error}
		<div
			class="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{data.error}
		</div>
	{/if}

	<div class="space-y-8">
		<div>
			<h2 class="mb-4 font-semibold">
				Pending Applications
				{#if pendingApps.length > 0}
					<span class="ml-2 rounded-full bg-yellow-500/10 px-2 py-0.5 text-sm text-yellow-600">
						{pendingApps.length}
					</span>
				{/if}
			</h2>

			{#if pendingApps.length > 0}
				<div class="space-y-4">
					{#each pendingApps as app}
						<div class="rounded-lg border bg-card p-6">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-3">
										<h3 class="font-semibold">{app.user_name}</h3>
										<span
											class="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize"
										>
											{app.provider_type}
										</span>
									</div>
									<p class="mt-1 text-sm text-muted-foreground">{app.user_email}</p>

									<div class="mt-4 grid grid-cols-2 gap-4 text-sm">
										<div>
											<p class="font-medium">Phone</p>
											<p class="text-muted-foreground">{app.phone}</p>
										</div>
										{#if app.years_experience > 0}
											<div>
												<p class="font-medium">Experience</p>
												<p class="text-muted-foreground">{app.years_experience} years</p>
											</div>
										{/if}
									</div>

									{#if app.bio}
										<div class="mt-4">
											<p class="font-medium">Bio</p>
											<p class="mt-1 text-sm text-muted-foreground">{app.bio}</p>
										</div>
									{/if}

									<div class="mt-4 flex gap-4 text-sm">
										{#if app.instagram_url}
											<a
												href={app.instagram_url}
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline"
											>
												Instagram
											</a>
										{/if}
										{#if app.telegram_url}
											<a
												href={app.telegram_url}
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline"
											>
												Telegram
											</a>
										{/if}
										{#if app.facebook_url}
											<a
												href={app.facebook_url}
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline"
											>
												Facebook
											</a>
										{/if}
									</div>
								</div>

								<div class="flex flex-col gap-2">
									<button
										onclick={() => acceptApplication(app)}
										disabled={processing[app.id]}
										class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
									>
										{processing[app.id] === 'accept' ? 'Accepting...' : 'Accept'}
									</button>
									<button
										onclick={() => openRejectModal(app)}
										disabled={processing[app.id]}
										class="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
									>
										{processing[app.id] === 'reject' ? 'Rejecting...' : 'Reject'}
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-lg border border-dashed p-8 text-center">
					<p class="text-muted-foreground">No pending applications.</p>
				</div>
			{/if}
		</div>

		{#if processedApps.length > 0}
			<div>
				<h2 class="mb-4 font-semibold">Processed Applications</h2>
				<div class="overflow-hidden rounded-lg border">
					<table class="min-w-full divide-y divide-border">
						<thead class="bg-muted/50">
							<tr>
								<th class="px-4 py-3 text-left text-sm font-medium">Applicant</th>
								<th class="px-4 py-3 text-left text-sm font-medium">Type</th>
								<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
								<th class="px-4 py-3 text-left text-sm font-medium">Date</th>
								<th class="px-4 py-3 text-left text-sm font-medium">Admin Note</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border bg-card">
							{#each processedApps as app}
								<tr>
									<td class="px-4 py-3">
										<p class="font-medium">{app.user_name}</p>
										<p class="text-xs text-muted-foreground">{app.user_email}</p>
									</td>
									<td class="px-4 py-3 capitalize">{app.provider_type}</td>
									<td class="px-4 py-3">
										{#if app.status === 'accepted'}
											<span
												class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600"
											>
												Accepted
											</span>
										{:else}
											<span
												class="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600"
											>
												Rejected
											</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-sm text-muted-foreground">
										{formatDate(app.updated_at)}
									</td>
									<td class="px-4 py-3 text-sm text-muted-foreground">
										{app.admin_note || '-'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if showRejectModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-md rounded-lg bg-card p-6">
			<h3 class="mb-4 font-heading text-lg font-semibold">Reject Application</h3>
			<p class="mb-4 text-sm text-muted-foreground">
				Provide a reason for rejecting this application. The applicant will be notified via email.
			</p>
			<textarea
				bind:value={rejectNote}
				rows="4"
				class="mb-4 w-full rounded-md border bg-background px-3 py-2 text-sm"
				placeholder="Reason for rejection (optional)"
			></textarea>
			<div class="flex justify-end gap-3">
				<button
					onclick={closeRejectModal}
					class="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
				>
					Cancel
				</button>
				<button
					onclick={submitReject}
					disabled={processing[rejectingApp?.id]}
					class="text-destructive-foreground rounded-md bg-destructive px-4 py-2 text-sm font-medium transition-colors hover:bg-destructive/90 disabled:opacity-50"
				>
					{processing[rejectingApp?.id] === 'reject' ? 'Rejecting...' : 'Reject Application'}
				</button>
			</div>
		</div>
	</div>
{/if}
