import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { api } from '$lib/api/client.js';

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load() {
	if (!browser) {
		throw redirect(302, '/login');
	}

	let currentUser = null;

	try {
		currentUser = await api.users.me();
	} catch (err) {
		console.error('Session expired, redirecting to login');
		throw redirect(302, '/login');
	}

	try {
		const response = await api.bookings.getUserBookings(currentUser.id);
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
			user: currentUser
		};
	} catch (/** @type {any} */ err) {
		console.error('Failed to load bookings:', err);
		return {
			bookings: [],
			user: currentUser,
			error: err?.message || 'Failed to load bookings'
		};
	}
}
