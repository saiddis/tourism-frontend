import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';
import { get } from 'svelte/store';

export const ssr = false;

export async function load() {
	if (!browser) {
		return { providers: [], user: null };
	}

	const currentUser = get(user);

	if (!currentUser) {
		goto('/login');
		return;
	}

	if (currentUser.role !== 'admin') {
		goto('/');
		return;
	}

	try {
		const providers = await api.providers.list();
		return { providers, user: currentUser };
	} catch {
		return { providers: [], user: currentUser, error: 'Failed to load providers' };
	}
}
