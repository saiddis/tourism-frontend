import { get } from 'svelte/store';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const currentUser = get(user);

	try {
		const destinations = await api.destinations.list();
		return { destinations, user: currentUser };
	} catch {
		return { destinations: [], user: currentUser, error: 'Unable to load destinations' };
	}
}
