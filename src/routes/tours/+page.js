import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url, data }) {
	const destinationId = url.searchParams.get('destination');
	try {
		const tours = await api.tours.list();
		/** @type {typeof tours} */
		let filteredTours = tours;
		if (destinationId) {
			filteredTours = tours.filter(
				(/** @type {any} */ t) => t.destination_id === parseInt(destinationId)
			);
		}
		const destination = destinationId ? await api.destinations.get(destinationId) : null;
		const destinations = await api.destinations.list();
		return { tours: filteredTours, destination, destinations, user: data?.user };
	} catch {
		return {
			tours: [],
			destination: null,
			destinations: [],
			user: data?.user ?? null,
			error: 'Unable to load tours'
		};
	}
}
