import { get } from 'svelte/store';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const currentUser = get(user);

	try {
		const [provider, allTours, destinations] = await Promise.all([
			api.providers.get(params.id),
			api.tours.list(),
			api.destinations.list()
		]);

		if (!provider) {
			throw error(404, 'Provider not found');
		}

		/** @type {any[]} */
		const tours = allTours.filter((/** @type {any} */ tour) => tour.provider_id === provider.id);

		return { provider, tours, destinations, user: currentUser };
	} catch (/** @type {any} */ err) {
		if (err?.status === 404) {
			throw err;
		}
		throw error(404, 'Provider not found');
	}
}
