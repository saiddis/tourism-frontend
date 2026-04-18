import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/auth.js';
import { get } from 'svelte/store';

export const ssr = false;

export function load() {
	if (!browser) {
		return { user: null };
	}

	const currentUser = get(user);

	if (!currentUser) {
		goto('/login');
		return;
	}

	return { user: currentUser };
}
