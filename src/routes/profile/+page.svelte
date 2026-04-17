<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api/client.js';
	import { API_BASE } from '$lib/api/constants.js';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	let user = $state(null);
	let loading = $state(true);
	let editMode = $state(false);
	let depositModal = $state(false);
	let avatarUrlInput = $state('');

	let editForm = $state({
		name: '',
		email: ''
	});

	let depositForm = $state({
		amount: '',
		loading: false,
		error: ''
	});

	let fileInput = $state(null);
	let dragOver = $state(false);

	async function loadUser() {
		try {
			user = await api.users.me();
			editForm.name = user.name;
			editForm.email = user.email;
		} catch (err) {
			goto('/login');
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadUser();
	});

	function getAvatarSrc(avatarUrl) {
		if (!avatarUrl) return null;
		if (avatarUrl.startsWith('http')) return avatarUrl;
		return API_BASE + avatarUrl;
	}

	async function handleUpdateProfile() {
		try {
			const updated = await api.users.update({
				name: editForm.name,
				email: editForm.email
			});
			user = updated;
			localStorage.setItem('user', JSON.stringify(updated));
			await invalidateAll();
			editMode = false;
		} catch (err) {
			alert(err.message || 'Failed to update profile');
		}
	}

	async function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		await uploadFile(file);
	}

	async function handleDrop(e) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith('image/')) {
			await uploadFile(file);
		}
	}

	async function uploadFile(file) {
		try {
			const updated = await api.users.uploadAvatar(file);
			user = updated;
			localStorage.setItem('user', JSON.stringify(updated));
			await invalidateAll();
		} catch (err) {
			alert(err.message || 'Failed to upload avatar');
		}
	}

	async function handleUrlSubmit() {
		if (!avatarUrlInput.trim()) return;
		try {
			const updated = await api.users.setAvatarUrl(avatarUrlInput.trim());
			user = updated;
			localStorage.setItem('user', JSON.stringify(updated));
			await invalidateAll();
			avatarUrlInput = '';
		} catch (err) {
			alert(err.message || 'Failed to set avatar URL');
		}
	}

	async function handleDeposit() {
		const amount = parseFloat(depositForm.amount);
		if (isNaN(amount) || amount <= 0) {
			depositForm.error = 'Please enter a valid amount';
			return;
		}

		depositForm.loading = true;
		depositForm.error = '';

		try {
			const updated = await api.users.deposit(amount);
			user = updated;
			localStorage.setItem('user', JSON.stringify(updated));
			await invalidateAll();
			depositModal = false;
			depositForm.amount = '';
		} catch (err) {
			depositForm.error = err.message || 'Failed to deposit';
		} finally {
			depositForm.loading = false;
		}
	}

	function formatBalance(balance) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'TJS'
		}).format(balance || 0);
	}
</script>

<svelte:head><title>Profile | The Curated Horizon</title></svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-12">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
		</div>
	{:else if user}
		<div class="space-y-8">
			<div class="text-center">
				<h1 class="font-heading text-3xl font-bold">My Profile</h1>
				<p class="mt-2 text-muted-foreground">Manage your account settings</p>
			</div>

			<div class="rounded-lg border bg-card">
				<div class="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
					<div class="relative">
						<Avatar size="lg" class="h-32 w-32">
							<AvatarImage src={getAvatarSrc(user.avatar_url)} alt={user.name} />
							<AvatarFallback class="text-4xl">{user.name?.charAt(0) || 'U'}</AvatarFallback>
						</Avatar>
						<button
							onclick={() => fileInput?.click()}
							type="button"
							class="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90"
							title="Upload avatar"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
								<line x1="16" x2="2" y1="5" y2="19" />
								<line x1="2" x2="22" y1="12" y2="12" />
								<line x1="2" x2="22" y1="5" y2="5" />
							</svg>
						</button>
						<input
							bind:this={fileInput}
							type="file"
							accept="image/*"
							onchange={handleFileSelect}
							class="hidden"
						/>
					</div>

					<div class="flex-1 text-center sm:text-left">
						<h2 class="font-heading text-2xl font-bold">{user.name}</h2>
						<p class="text-muted-foreground">{user.email}</p>
						<span
							class="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary"
						>
							{user.role}
						</span>
					</div>

					<div class="rounded-lg border bg-muted/50 p-4 text-center">
						<p class="text-sm text-muted-foreground">Balance</p>
						<p class="font-heading text-2xl font-bold">{formatBalance(user.balance)}</p>
						<button
							onclick={() => (depositModal = true)}
							type="button"
							class="mt-2 text-sm font-medium text-primary hover:underline"
						>
							Add Funds
						</button>
					</div>
				</div>
			</div>

			<div class="rounded-lg border bg-card p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="font-heading text-lg font-semibold">Account Information</h3>
					{#if !editMode}
						<button
							onclick={() => (editMode = true)}
							type="button"
							class="text-sm font-medium text-primary hover:underline"
						>
							Edit
						</button>
					{/if}
				</div>

				{#if editMode}
					<form onsubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} class="space-y-4">
						<div>
							<label for="name" class="mb-2 block text-sm font-medium">Full Name</label>
							<input
								id="name"
								type="text"
								bind:value={editForm.name}
								required
								class="w-full rounded-md border bg-background px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label for="email" class="mb-2 block text-sm font-medium">Email</label>
							<input
								id="email"
								type="email"
								bind:value={editForm.email}
								required
								class="w-full rounded-md border bg-background px-3 py-2 text-sm"
							/>
						</div>
						<div class="flex gap-2">
							<button
								type="submit"
								class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
							>
								Save Changes
							</button>
							<button
								type="button"
								onclick={() => (editMode = false)}
								class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
							>
								Cancel
							</button>
						</div>
					</form>
				{:else}
					<dl class="space-y-3">
						<div class="flex justify-between">
							<dt class="text-sm text-muted-foreground">Full Name</dt>
							<dd class="text-sm font-medium">{user.name}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-muted-foreground">Email</dt>
							<dd class="text-sm font-medium">{user.email}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-muted-foreground">Role</dt>
							<dd class="text-sm font-medium capitalize">{user.role}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-sm text-muted-foreground">Member Since</dt>
							<dd class="text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</dd>
						</div>
					</dl>
				{/if}
			</div>

			<div class="rounded-lg border bg-card p-6">
				<h3 class="mb-4 font-heading text-lg font-semibold">Set Avatar from URL</h3>
				<div class="flex gap-2">
					<input
						type="url"
						placeholder="https://example.com/avatar.jpg"
						bind:value={avatarUrlInput}
						class="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
					/>
					<button
						onclick={handleUrlSubmit}
						type="button"
						class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Set Avatar
					</button>
				</div>
				<p class="mt-2 text-xs text-muted-foreground">
					Paste an image URL to use as your avatar
				</p>
			</div>

			<div
				class="rounded-lg border border-dashed p-8 text-center"
				role="region"
				aria-label="Avatar drop zone"
				class:border-primary={dragOver}
				class:bg-primary/5={dragOver}
				ondragover={(e) => { e.preventDefault(); dragOver = true; }}
				ondragleave={() => (dragOver = false)}
				ondrop={handleDrop}
			>
				<svg
					class="mx-auto h-12 w-12 text-muted-foreground"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" x2="12" y1="3" y2="15" />
				</svg>
				<p class="mt-4 text-sm text-muted-foreground">
					Drag and drop an image here, or
					<button
						type="button"
						onclick={() => fileInput?.click()}
						class="font-medium text-primary hover:underline"
					>
						browse
					</button>
				</p>
				<p class="mt-1 text-xs text-muted-foreground">
					JPG, PNG, WebP, or GIF (max 5MB)
				</p>
			</div>
		</div>
	{/if}
</div>

{#if depositModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
			<h3 class="font-heading text-xl font-semibold">Add Funds</h3>
			<p class="mt-1 text-sm text-muted-foreground">Enter the amount you want to add to your balance</p>

			<form onsubmit={(e) => { e.preventDefault(); handleDeposit(); }} class="mt-6 space-y-4">
				<div>
					<label for="amount" class="mb-2 block text-sm font-medium">Amount (TJS)</label>
					<input
						id="amount"
						type="number"
						step="0.01"
						min="0.01"
						bind:value={depositForm.amount}
						placeholder="0.00"
						required
						class="w-full rounded-md border bg-background px-3 py-2 text-sm"
					/>
				</div>

				{#if depositForm.error}
					<p class="text-sm text-destructive">{depositForm.error}</p>
				{/if}

				<div class="flex gap-2">
					<button
						type="submit"
						disabled={depositForm.loading}
						class="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					>
						{depositForm.loading ? 'Processing...' : 'Add Funds'}
					</button>
					<button
						type="button"
						onclick={() => { depositModal = false; depositForm.error = ''; }}
						class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
