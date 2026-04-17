import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export function load() {
	if (browser) {
		const userJson = localStorage.getItem('user');
		if (!userJson) {
			throw redirect(302, '/login');
		}
	}
	return {};
}
