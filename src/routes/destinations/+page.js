import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	try {
		const destinations = await api.destinations.list();
		return { destinations };
	} catch {
		return { destinations: [], error: 'Unable to load destinations' };
	}
}
