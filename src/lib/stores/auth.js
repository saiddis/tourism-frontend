import { writable } from 'svelte/store';

function createAuthStore() {
	const { subscribe, set, update } = writable(null);

	return {
		subscribe,
		set,
		clear: () => set(null)
	};
}

export const user = createAuthStore();
