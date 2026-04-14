import { redirect } from '@sveltejs/kit';
import { api } from '$lib/api/client.js';
import { getStoredUser } from '$lib/api/client.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const user = getStoredUser();
	if (!user) {
		throw redirect(302, '/login');
	}

	try {
		const [bookings, tours, destinations] = await Promise.all([
			api.bookings.getUserBookings(user.id),
			api.tours.list(),
			api.destinations.list()
		]);

		const enrichedBookings = bookings.map((booking) => {
			const tour = tours.find((t) => t.id === booking.tour_id);
			const destination = tour ? destinations.find((d) => d.id === tour.destination_id) : null;
			return {
				...booking,
				tour,
				destination
			};
		});

		return {
			bookings: enrichedBookings,
			user
		};
	} catch (error) {
		return {
			bookings: [],
			user,
			error: error.message
		};
	}
}
