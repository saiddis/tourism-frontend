export const API_BASE = import.meta.env.VITE_API_URL;

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
		/** @param {number|string} id */
		update: (id) => `/tours/${id}`,
		/** @param {number|string} id */
		delete: (id) => `/tours/${id}`
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
