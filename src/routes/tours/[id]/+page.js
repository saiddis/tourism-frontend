import { api } from '$lib/api/client.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const [tour, reviews, destinations] = await Promise.all([
			api.tours.get(params.id),
			api.reviews.getTourReviews(params.id),
			api.destinations.list()
		]);
		const destination = destinations.find((d) => d.id === tour.destination_id);
		return { tour, reviews, destination };
	} catch {
		throw error(404, 'Tour not found');
	}
}
