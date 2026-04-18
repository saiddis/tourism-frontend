export const API_BASE = import.meta.env.VITE_API_URL;

/** @param {string | undefined | null} url */
export function getImageUrl(url) {
	if (!url) return null;
	if (url.startsWith('http')) return url;
	return API_BASE + url;
}

/** @type {Record<string, any>} */
export const Endpoints = {
	auth: {
		register: '/auth/register',
		login: '/auth/login',
		refresh: '/auth/refresh',
		logout: '/auth/logout'
	},
	users: {
		list: '/users',
		me: '/users/me',
		updateMe: '/users/me',
		uploadAvatar: '/users/me/avatar',
		setAvatarUrl: '/users/me/avatar-url',
		deposit: '/users/deposit',
		/** @param {number|string} id */
		get: (id) => `/users/${id}`
	},
	destinations: {
		list: '/destinations',
		/** @param {number|string} id */
		get: (id) => `/destinations/${id}`,
		create: '/destinations',
		/** @param {number|string} id */
		delete: (id) => `/destinations/${id}`
	},
	tours: {
		list: '/tours',
		/** @param {number|string} id */
		get: (id) => `/tours/${id}`,
		create: '/tours',
		createForProvider: '/providers/me/tours',
		/** @param {number|string} id */
		update: (id) => `/tours/${id}`,
		/** @param {number|string} id */
		delete: (id) => `/tours/${id}`,
		/** @param {number|string} id */
		renew: (id) => `/tours/${id}/renew`,
		/** @param {number|string} tourId */
		highlights: (tourId) => `/tours/${tourId}/highlights`,
		/** @param {number|string} tourId */
		createHighlight: (tourId) => `/tours/${tourId}/highlights`,
		/** @param {number|string} tourId @param {number|string} highlightId */
		deleteHighlight: (tourId, highlightId) => `/tours/${tourId}/highlights/${highlightId}`
	},
	bookings: {
		list: '/bookings',
		/** @param {number|string} id */
		get: (id) => `/bookings/${id}`,
		create: '/bookings',
		/** @param {number|string} id */
		delete: (id) => `/bookings/${id}`,
		/** @param {number|string} userId */
		userBookings: (userId) => `/bookings/user/${userId}`,
		/** @param {number|string} id */
		updateStatus: (id) => `/bookings/${id}/status`
	},
	payments: {
		/** @param {number|string} id */
		get: (id) => `/payments/${id}`,
		create: '/payments',
		/** @param {number|string} id */
		updateStatus: (id) => `/payments/${id}/status`
	},
	reviews: {
		create: '/reviews',
		/** @param {number|string} tourId */
		tourReviews: (tourId) => `/reviews/tour/${tourId}`,
		/** @param {number|string} id */
		delete: (id) => `/reviews/${id}`
	},
	providers: {
		list: '/providers',
		listActive: '/providers/active',
		/** @param {number|string} id */
		get: (id) => `/providers/${id}`,
		/** @param {number|string} userId */
		getByUserId: (userId) => `/providers/user/${userId}`,
		create: '/providers',
		/** @param {number|string} id */
		update: (id) => `/providers/${id}`,
		/** @param {number|string} id */
		toggleActive: (id) => `/providers/${id}/active`
	},
	providerApplications: {
		submit: '/provider-applications',
		getMine: '/provider-applications/me',
		list: '/provider-applications',
		/** @param {number|string} id */
		accept: (id) => `/provider-applications/${id}/accept`,
		/** @param {number|string} id */
		reject: (id) => `/provider-applications/${id}/reject`
	}
};

export class ApiError extends Error {
	/** @param {number} status @param {string} message @param {any} body */
	constructor(status, message, body) {
		super(message);
		this.status = status;
		this.message = message;
		this.body = body;
		this.name = 'ApiError';
	}
}
