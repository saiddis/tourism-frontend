import { api } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const destinationId = url.searchParams.get('destination');
	try {
		const tours = await api.tours.list();
		let filteredTours = tours;
		if (destinationId) {
			filteredTours = tours.filter((t) => t.destination_id === parseInt(destinationId));
		}
		const destination = destinationId ? await api.destinations.get(destinationId) : null;
		return { tours: filteredTours, destination };
	} catch {
		return { tours: [], destination: null, error: 'Unable to load tours' };
	}
}
