import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const destinationId = url.searchParams.get('destination');
	try {
		const [destinations, tours] = await Promise.all([api.destinations.list(), api.tours.list()]);
		let filteredTours = tours;
		if (destinationId) {
			filteredTours = tours.filter((t) => t.destination_id === parseInt(destinationId));
		}
		const destination = destinationId
			? destinations.find((d) => d.id === parseInt(destinationId))
			: null;
		return { tours: filteredTours, destinations, destination };
	} catch {
		return { tours: [], destinations: [], destination: null, error: 'Unable to load tours' };
	}
}
