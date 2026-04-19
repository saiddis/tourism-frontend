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
		register: '/api/auth/register',
		login: '/api/auth/login',
		refresh: '/api/auth/refresh',
		logout: '/api/auth/logout'
	},
	users: {
		list: '/api/users',
		me: '/api/users/me',
		updateMe: '/api/users/me',
		uploadAvatar: '/api/users/me/avatar',
		setAvatarUrl: '/api/users/me/avatar-url',
		deposit: '/api/users/deposit',
		/** @param {number|string} id */
		get: (id) => `/api/users/${id}`
	},
	destinations: {
		list: '/api/destinations',
		/** @param {number|string} id */
		get: (id) => `/api/destinations/${id}`,
		create: '/api/destinations',
		/** @param {number|string} id */
		delete: (id) => `/api/destinations/${id}`
	},
	tours: {
		list: '/api/tours',
		/** @param {number|string} id */
		get: (id) => `/api/tours/${id}`,
		create: '/api/tours',
		createForProvider: '/api/providers/me/tours',
		/** @param {number|string} id */
		update: (id) => `/api/tours/${id}`,
		/** @param {number|string} id */
		delete: (id) => `/api/tours/${id}`,
		/** @param {number|string} id */
		renew: (id) => `/api/tours/${id}/renew`,
		/** @param {number|string} tourId */
		highlights: (tourId) => `/api/tours/${tourId}/highlights`,
		/** @param {number|string} tourId */
		createHighlight: (tourId) => `/api/tours/${tourId}/highlights`,
		/** @param {number|string} tourId @param {number|string} highlightId */
		deleteHighlight: (tourId, highlightId) => `/api/tours/${tourId}/highlights/${highlightId}`
	},
	bookings: {
		list: '/api/bookings',
		/** @param {number|string} id */
		get: (id) => `/api/bookings/${id}`,
		create: '/api/bookings',
		/** @param {number|string} id */
		delete: (id) => `/api/bookings/${id}`,
		/** @param {number|string} userId */
		userBookings: (userId) => `/api/bookings/user/${userId}`,
		/** @param {number|string} id */
		updateStatus: (id) => `/api/bookings/${id}/status`
	},
	payments: {
		/** @param {number|string} id */
		get: (id) => `/api/payments/${id}`,
		create: '/api/payments',
		/** @param {number|string} id */
		updateStatus: (id) => `/api/payments/${id}/status`
	},
	reviews: {
		create: '/api/reviews',
		/** @param {number|string} tourId */
		tourReviews: (tourId) => `/api/reviews/tour/${tourId}`,
		/** @param {number|string} id */
		delete: (id) => `/api/reviews/${id}`
	},
	providers: {
		list: '/api/providers',
		listActive: '/api/providers/active',
		/** @param {number|string} id */
		get: (id) => `/api/providers/${id}`,
		/** @param {number|string} userId */
		getByUserId: (userId) => `/api/providers/user/${userId}`,
		create: '/api/providers',
		/** @param {number|string} id */
		update: (id) => `/api/providers/${id}`,
		/** @param {number|string} id */
		toggleActive: (id) => `/api/providers/${id}/active`
	},
	providerApplications: {
		submit: '/api/provider-applications',
		getMine: '/api/provider-applications/me',
		list: '/api/provider-applications',
		/** @param {number|string} id */
		accept: (id) => `/api/provider-applications/${id}/accept`,
		/** @param {number|string} id */
		reject: (id) => `/api/provider-applications/${id}/reject`
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
