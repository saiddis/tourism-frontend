import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';
import { get } from 'svelte/store';

export const ssr = false;

export async function load() {
	if (!browser) {
		return { applications: [], user: null };
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
		const applications = await api.providerApplications.list();
		return { applications, user: currentUser };
	} catch {
		return { applications: [], user: currentUser, error: 'Failed to load applications' };
	}
}
