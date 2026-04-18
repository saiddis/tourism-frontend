import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { user } from '$lib/stores/auth.js';

export const ssr = false;

export function load() {
	if (browser) {
		let currentUser;
		user.subscribe((u) => {
			currentUser = u;
		})();

		if (!currentUser) {
			throw redirect(302, '/login');
		}
	}
	return {};
}
