import { API_BASE, Endpoints, ApiError } from './constants.js';

function getAccessToken() {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('access_token');
}

/** @param {any} user @param {{ access_token: string }} tokens */
function setAuthData(user, tokens) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem('user', JSON.stringify(user));
	localStorage.setItem('access_token', tokens.access_token);
	localStorage.removeItem('refresh_token');
}

function clearAuthData() {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem('user');
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
}

function getStoredUser() {
	if (typeof localStorage === 'undefined') return null;
	const userJson = localStorage.getItem('user');
	return userJson ? JSON.parse(userJson) : null;
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
		clearAuthData();
		const errorData = await parseResponse(response).catch(() => ({}));
		throw new ApiError(response.status, errorData.error || 'Token refresh failed', errorData);
	}

	const tokens = await parseResponse(response);
	const user = getStoredUser();
	if (user) {
		setAuthData(user, tokens);
	}
	return tokens;
}

/** @param {string} endpoint @param {RequestInit & { headers?: HeadersInit }} [options={}] */
async function request(endpoint, options = {}) {
	const url = API_BASE + endpoint;
	const accessToken = getAccessToken();

	const headers = /** @type {Record<string, string>} */ ({
		'Content-Type': 'application/json',
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
				clearAuthData();
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
			if (response && response.user && response.access_token) {
				setAuthData(response.user, response);
			}
			return response;
		},
		/** @param {string} email @param {string} password */
		async login(email, password) {
			const response = await request(Endpoints.auth.login, {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});

			const tokens = response;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('access_token', tokens.access_token);
			}
			const user = await api.users.me();
			setAuthData(user, tokens);
			return { user, tokens };
		},
		async refresh() {
			return refreshAccessToken();
		},
		async logout() {
			try {
				return await request(Endpoints.auth.logout, { method: 'DELETE' });
			} finally {
				clearAuthData();
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
			const response = await fetch(API_BASE + Endpoints.users.uploadAvatar, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			});
			if (!response.ok) {
				const text = await response.text();
				const errorData = text ? JSON.parse(text) : {};
				throw new ApiError(response.status, errorData.error || 'Upload failed', errorData);
			}
			const data = await response.json();
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
			return response;
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
			const response = await request(Endpoints.destinations.create, {
				method: 'POST',
				body: JSON.stringify(data)
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
			return response;
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
	}
};

export { getStoredUser, clearAuthData, getAccessToken };
