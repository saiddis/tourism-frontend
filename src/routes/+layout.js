import { browser } from '$app/environment';

/** @type {import('./$types').LayoutLoad} */
export function load() {
	if (!browser) {
		return { user: null, accessToken: null, refreshToken: null };
	}
	const accessToken = localStorage.getItem('access_token');
	const refreshToken = localStorage.getItem('refresh_token');
	const userJson = localStorage.getItem('user');
	const user = userJson ? JSON.parse(userJson) : null;
	return { user, accessToken, refreshToken };
}
