import { get } from 'svelte/store';
import { user } from '$lib/stores/auth.js';
import { api } from '$lib/api/client.js';

export async function load() {
	const currentUser = get(user);

	try {
		const providers = await api.providers.listActive();
		return { providers, user: currentUser };
	} catch (err) {
		return { providers: [], user: currentUser, error: 'Failed to load providers' };
	}
}
