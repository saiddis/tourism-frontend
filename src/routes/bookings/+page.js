import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';
import { get } from 'svelte/store';

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load() {
	if (!browser) {
		return { bookings: [], user: null };
	}

	const currentUser = get(user);

	if (!currentUser) {
		throw redirect(302, '/login');
	}

	try {
		const response = await api.bookings.getUserBookings(currentUser.user_id);
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
