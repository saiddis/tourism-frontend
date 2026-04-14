import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	try {
		const [destinations, tours] = await Promise.all([api.destinations.list(), api.tours.list()]);
		return {
			destinations,
			tours
		};
	} catch {
		return {
			destinations: [],
			tours: []
		};
	}
}
