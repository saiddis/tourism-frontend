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
		const response = await api.bookings.getUserBookings(user.id);
		let bookings = [];

		if (response) {
			if (Array.isArray(response)) {
				bookings = response;
			} else if (typeof response === 'object') {
				bookings = Object.values(response);
			}
		}

		return {
			bookings,
			user
		};
	} catch (/** @type {any} */ err) {
		console.error('Failed to load bookings:', err);
		return {
			bookings: [],
			user,
			error: err?.message || 'Failed to load bookings'
		};
	}
}
