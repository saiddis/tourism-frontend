import { browser } from '$app/environment';
import { api } from '$lib/api/client.js';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	let currentUser = null;

	if (browser) {
		try {
			currentUser = await api.users.me();
		} catch {
			// User not logged in - that's fine, they can still view the tour
		}
	}

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
		return { tour, reviews, destination, user: currentUser };
	} catch (/** @type {any} */ err) {
		if (err?.status === 404) {
			throw err;
		}
		throw error(404, 'Tour not found');
	}
}
