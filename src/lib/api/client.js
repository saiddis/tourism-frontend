import { API_BASE, Endpoints, ApiError } from './constants.js';

function getAccessToken() {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('access_token');
}

function setAccessToken(/** @type {{ access_token: string }} */ tokens) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem('access_token', tokens.access_token);
	localStorage.removeItem('refresh_token');
}

function clearAccessToken() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
}

/** @param {Response} response */
async function parseResponse(response) {
	const text = await response.text();
	return text ? JSON.parse(text) : null;
}

async function refreshAccessToken() {
	const response = await fetch(API_BASE + Endpoints.auth.refresh, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include'
	});

	if (!response.ok) {
		clearAccessToken();
		const errorData = await parseResponse(response).catch(() => ({}));
		throw new ApiError(response.status, errorData.error || 'Token refresh failed', errorData);
	}

	const tokens = await parseResponse(response);
	setAccessToken(tokens);
	return tokens;
}

/** @param {string} endpoint @param {RequestInit & { headers?: HeadersInit }} [options={}] */
async function request(endpoint, options = {}) {
	const url = API_BASE + endpoint;
	const accessToken = getAccessToken();

	const isFormData = options.body instanceof FormData;
	const headers = /** @type {Record<string, string>} */ ({
		...(isFormData ? {} : { 'Content-Type': 'application/json' }),
		...(options.headers || {})
	});

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response = await fetch(url, {
		...options,
		headers,
		credentials: 'include'
	});

	if (response.status === 401 && !endpoint.startsWith('/auth/')) {
		try {
			await refreshAccessToken();
			const retryHeaders = /** @type {Record<string, string>} */ ({
				'Content-Type': 'application/json',
				...(options.headers || {})
			});
			const refreshedAccessToken = getAccessToken();
			if (refreshedAccessToken) {
				retryHeaders['Authorization'] = `Bearer ${refreshedAccessToken}`;
			}
			const retryResponse = await fetch(url, {
				...options,
				headers: retryHeaders,
				credentials: 'include'
			});
			if (!retryResponse.ok) {
				const errorData = await parseResponse(retryResponse).catch(() => ({}));
				throw new ApiError(
					retryResponse.status,
					errorData.error || `Request failed with status ${retryResponse.status}`,
					errorData
				);
			}
			return parseResponse(retryResponse);
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) {
				clearAccessToken();
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}
			}
			throw e;
		}
	}

	if (!response.ok) {
		const errorData = await parseResponse(response).catch(() => ({}));
		throw new ApiError(
			response.status,
			errorData.error || `Request failed with status ${response.status}`,
			errorData
		);
	}

	return parseResponse(response);
}

export const api = {
	auth: {
		/** @param {any} data */
		async register(data) {
			const response = await request(Endpoints.auth.register, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			if (response && response.access_token) {
				setAccessToken(response);
			}
			return response;
		},
		/** @param {string} email @param {string} password */
		async login(email, password) {
			const response = await request(Endpoints.auth.login, {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});

			if (response?.access_token && typeof localStorage !== 'undefined') {
				localStorage.setItem('access_token', response.access_token);
			}
			return response;
		},
		async refresh() {
			return refreshAccessToken();
		},
		async logout() {
			try {
				return await request(Endpoints.auth.logout, { method: 'DELETE' });
			} finally {
				clearAccessToken();
			}
		}
	},

	users: {
		async list() {
			const response = await request(Endpoints.users.list);
			return response || [];
		},
		async me() {
			const response = await request(Endpoints.users.me);
			return response;
		},
		/** @param {{ name: string, email: string }} data */
		async update(data) {
			const response = await request(Endpoints.users.updateMe, {
				method: 'PATCH',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {File} file */
		async uploadAvatar(file) {
			const formData = new FormData();
			formData.append('avatar', file);
			const data = await request(Endpoints.users.uploadAvatar, {
				method: 'POST',
				body: formData
			});
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('user', JSON.stringify(data));
			}
			return data;
		},
		/** @param {string} url */
		async setAvatarUrl(url) {
			const response = await request(Endpoints.users.setAvatarUrl, {
				method: 'PUT',
				body: JSON.stringify({ avatar_url: url })
			});
			return response;
		},
		/** @param {number} amount */
		async deposit(amount) {
			const response = await request(Endpoints.users.deposit, {
				method: 'POST',
				body: JSON.stringify({ amount })
			});
			if (response?.access_token && typeof localStorage !== 'undefined') {
				localStorage.setItem('access_token', response.access_token);
			}
			return response?.user || response;
		},
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.users.get(id));
			return response;
		}
	},

	destinations: {
		async list() {
			const response = await request(Endpoints.destinations.list);
			return response || [];
		},
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.destinations.get(id));
			return response;
		},
		/** @param {any} data */
		async create(data) {
			const isFormData = data instanceof FormData;
			const response = await request(Endpoints.destinations.create, {
				method: 'POST',
				body: isFormData ? data : JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} id */
		async delete(id) {
			const response = await request(Endpoints.destinations.delete(id), { method: 'DELETE' });
			return response;
		}
	},

	tours: {
		async list() {
			const response = await request(Endpoints.tours.list);
			return response || [];
		},
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.tours.get(id));
			return response;
		},
		/** @param {any} data */
		async create(data) {
			const response = await request(Endpoints.tours.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {any} data */
		async createForProvider(data) {
			const response = await request(Endpoints.tours.createForProvider, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} id @param {any} data */
		async update(id, data) {
			const response = await request(Endpoints.tours.update(id), {
				method: 'PUT',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} id */
		async delete(id) {
			const response = await request(Endpoints.tours.delete(id), { method: 'DELETE' });
			return response;
		},
		/** @param {number|string} id @param {any} data */
		async renew(id, data) {
			const response = await request(Endpoints.tours.renew(id), {
				method: 'PUT',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} tourId */
		async getHighlights(tourId) {
			const response = await request(Endpoints.tours.highlights(tourId));
			return response || [];
		},
		/** @param {number|string} tourId @param {any} data */
		async createHighlight(tourId, data) {
			const response = await request(Endpoints.tours.createHighlight(tourId), {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} tourId @param {File} file */
		async createHighlightWithFile(tourId, file) {
			const formData = new FormData();
			formData.append('image', file);

			const response = await request(Endpoints.tours.createHighlight(tourId), {
				method: 'POST',
				body: formData
			});
			return response;
		},
		/** @param {number|string} tourId @param {number|string} highlightId */
		async deleteHighlight(tourId, highlightId) {
			const response = await request(Endpoints.tours.deleteHighlight(tourId, highlightId), {
				method: 'DELETE'
			});
			return response;
		}
	},

	bookings: {
		async list() {
			const response = await request(Endpoints.bookings.list);
			return response || [];
		},
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.bookings.get(id));
			return response;
		},
		/** @param {number|string} tourId */
		async create(tourId) {
			const response = await request(Endpoints.bookings.create, {
				method: 'POST',
				body: JSON.stringify({ tour_id: tourId })
			});
			if (response?.access_token && typeof localStorage !== 'undefined') {
				localStorage.setItem('access_token', response.access_token);
			}
			return response?.booking || response;
		},
		/** @param {number|string} id */
		async delete(id) {
			const response = await request(Endpoints.bookings.delete(id), { method: 'DELETE' });
			return response;
		},
		/** @param {number|string} userId */
		async getUserBookings(userId) {
			const response = await request(Endpoints.bookings.userBookings(userId));
			return response || [];
		},
		/** @param {number|string} id @param {string} status */
		async updateStatus(id, status) {
			const response = await request(Endpoints.bookings.updateStatus(id), {
				method: 'PUT',
				body: JSON.stringify({ status })
			});
			return response;
		}
	},

	payments: {
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.payments.get(id));
			return response;
		},
		/** @param {number|string|null} bookingId @param {number} amount */
		async create(bookingId, amount) {
			const response = await request(Endpoints.payments.create, {
				method: 'POST',
				body: JSON.stringify({ booking_id: bookingId, amount })
			});
			return response;
		},
		/** @param {number|string} id @param {string} status */
		async updateStatus(id, status) {
			const response = await request(Endpoints.payments.updateStatus(id), {
				method: 'PUT',
				body: JSON.stringify({ status })
			});
			return response;
		}
	},

	reviews: {
		/** @param {any} data */
		async create(data) {
			const response = await request(Endpoints.reviews.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} tourId */
		async getTourReviews(tourId) {
			const response = await request(Endpoints.reviews.tourReviews(tourId));
			return response || [];
		},
		/** @param {number|string} id */
		async delete(id) {
			const response = await request(Endpoints.reviews.delete(id), { method: 'DELETE' });
			return response;
		}
	},

	providers: {
		async list() {
			const response = await request(Endpoints.providers.list);
			return response || [];
		},
		async listActive() {
			const response = await request(Endpoints.providers.listActive);
			return response || [];
		},
		/** @param {number|string} id */
		async get(id) {
			const response = await request(Endpoints.providers.get(id));
			return response;
		},
		/** @param {number|string} userId */
		async getByUserId(userId) {
			const response = await request(Endpoints.providers.getByUserId(userId));
			return response;
		},
		async getMine() {
			const response = await request(Endpoints.providers.list);
			return response;
		},
		/** @param {any} data */
		async create(data) {
			const response = await request(Endpoints.providers.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} id @param {any} data */
		async update(id, data) {
			const response = await request(Endpoints.providers.update(id), {
				method: 'PUT',
				body: JSON.stringify(data)
			});
			return response;
		},
		/** @param {number|string} id @param {boolean} active */
		async toggleActive(id, active) {
			const response = await request(Endpoints.providers.toggleActive(id), {
				method: 'PUT',
				body: JSON.stringify({ active })
			});
			return response;
		}
	},

	providerApplications: {
		/** @param {any} data */
		async submit(data) {
			const response = await request(Endpoints.providerApplications.submit, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		async getMine() {
			const response = await request(Endpoints.providerApplications.getMine);
			return response;
		},
		async list() {
			const response = await request(Endpoints.providerApplications.list);
			return response || [];
		},
		/** @param {number|string} id @param {string} [adminNote] */
		async accept(id, adminNote = '') {
			const response = await request(Endpoints.providerApplications.accept(id), {
				method: 'PUT',
				body: JSON.stringify({ admin_note: adminNote })
			});
			return response;
		},
		/** @param {number|string} id @param {string} [adminNote] */
		async reject(id, adminNote = '') {
			const response = await request(Endpoints.providerApplications.reject(id), {
				method: 'PUT',
				body: JSON.stringify({ admin_note: adminNote })
			});
			return response;
		}
	}
};

export { getAccessToken, setAccessToken, clearAccessToken, refreshAccessToken };
