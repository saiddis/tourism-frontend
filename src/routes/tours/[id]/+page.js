import { api } from '$lib/api/client.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const [tour, reviews] = await Promise.all([
			api.tours.get(params.id),
			api.reviews.getTourReviews(params.id)
		]);

		if (!tour) {
			throw error(404, 'Tour not found');
		}

		const destination = tour.destination_id
			? {
					id: tour.destination_id,
					name: tour.destination_name,
					description: tour.destination_description,
					image_url: tour.destination_image_url
				}
			: null;
		return { tour, reviews, destination };
	} catch (/** @type {any} */ err) {
		if (err?.status === 404) {
			throw err;
		}
		throw error(404, 'Tour not found');
	}
}
