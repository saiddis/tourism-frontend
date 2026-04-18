import { browser } from '$app/environment';
import { getAccessToken, clearAccessToken, refreshAccessToken } from '$lib/api/client.js';
import { decodeAccessToken, isTokenExpiringSoon } from '$lib/api/jwt.js';
import { user } from '$lib/stores/auth.js';

export const ssr = false;

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	if (!browser) {
		user.set(null);
		return { user: null };
	}

	const token = getAccessToken();

	if (!token) {
		user.set(null);
		return { user: null };
	}

	// Decode existing token synchronously
	const decodedUser = decodeAccessToken(token);

	if (!decodedUser) {
		clearAccessToken();
		user.set(null);
		return { user: null };
	}

	// Set user in store for immediate access
	user.set(decodedUser);

	// Check if token is expired or about to expire (< 1 minute left)
	if (isTokenExpiringSoon(decodedUser)) {
		try {
			const newTokens = await refreshAccessToken();
			if (newTokens?.access_token) {
				localStorage.setItem('access_token', newTokens.access_token);
				const newUser = decodeAccessToken(newTokens.access_token);
				user.set(newUser);
				return { user: newUser };
			}
		} catch {
			clearAccessToken();
			user.set(null);
			return { user: null };
		}
	}

	return { user: decodedUser };
}
