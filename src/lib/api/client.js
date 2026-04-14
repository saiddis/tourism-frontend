import { API_BASE, Endpoints, ApiError } from './constants.js';

function getAccessToken() {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('access_token');
}

function getRefreshToken() {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('refresh_token');
}

function setAuthData(user, tokens) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem('user', JSON.stringify(user));
	localStorage.setItem('access_token', tokens.access_token);
	localStorage.setItem('refresh_token', tokens.refresh_token);
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

async function refreshAccessToken() {
	const refreshToken = getRefreshToken();
	if (!refreshToken) {
		clearAuthData();
		throw new ApiError(401, 'No refresh token', null);
	}

	const response = await fetch(API_BASE + Endpoints.auth.refresh, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refresh_token: refreshToken })
	});

	if (!response.ok) {
		clearAuthData();
		const errorData = await response.json().catch(() => ({}));
		throw new ApiError(response.status, errorData.error || 'Token refresh failed', errorData);
	}

	const tokens = await response.json();
	const user = getStoredUser();
	if (user) {
		setAuthData(user, tokens);
	}
	return tokens;
}

async function request(endpoint, options = {}) {
	const url = API_BASE + endpoint;
	const accessToken = getAccessToken();

	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {})
	};

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response = await fetch(url, {
		...options,
		headers
	});

	if (response.status === 401 && options.method !== 'POST' && !endpoint.includes('/auth/')) {
		try {
			await refreshAccessToken();
			headers['Authorization'] = `Bearer ${getAccessToken()}`;
			const retryResponse = await fetch(url, { ...options, headers });
			if (!retryResponse.ok) {
				const errorData = await retryResponse.json().catch(() => ({}));
				throw new ApiError(
					retryResponse.status,
					errorData.error || `Request failed with status ${retryResponse.status}`,
					errorData
				);
			}
			return retryResponse.json();
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
		const errorData = await response.json().catch(() => ({}));
		throw new ApiError(
			response.status,
			errorData.error || `Request failed with status ${response.status}`,
			errorData
		);
	}

	const text = await response.text();
	return text ? JSON.parse(text) : null;
}

export const api = {
	auth: {
		async register(data) {
			const response = await request(Endpoints.auth.register, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		async login(email, password) {
			const response = await request(Endpoints.auth.login, {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			const tokens = response;
			const user = await api.users.get(0);
			setAuthData(user, tokens);
			return { user, tokens };
		},
		async refresh() {
			return refreshAccessToken();
		}
	},

	users: {
		async list() {
			const response = await request(Endpoints.users.list);
			return response || [];
		},
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
		async get(id) {
			const response = await request(Endpoints.destinations.get(id));
			return response;
		},
		async create(data) {
			const response = await request(Endpoints.destinations.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
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
		async get(id) {
			const response = await request(Endpoints.tours.get(id));
			return response;
		},
		async create(data) {
			const response = await request(Endpoints.tours.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		async update(id, data) {
			const response = await request(Endpoints.tours.update(id), {
				method: 'PUT',
				body: JSON.stringify(data)
			});
			return response;
		},
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
		async get(id) {
			const response = await request(Endpoints.bookings.get(id));
			return response;
		},
		async create(tourId) {
			const response = await request(Endpoints.bookings.create, {
				method: 'POST',
				body: JSON.stringify({ tour_id: tourId })
			});
			return response;
		},
		async delete(id) {
			const response = await request(Endpoints.bookings.delete(id), { method: 'DELETE' });
			return response;
		},
		async getUserBookings(userId) {
			const response = await request(Endpoints.bookings.userBookings(userId));
			return response || [];
		},
		async updateStatus(id, status) {
			const response = await request(Endpoints.bookings.updateStatus(id), {
				method: 'PUT',
				body: JSON.stringify({ status })
			});
			return response;
		}
	},

	payments: {
		async get(id) {
			const response = await request(Endpoints.payments.get(id));
			return response;
		},
		async create(bookingId, amount) {
			const response = await request(Endpoints.payments.create, {
				method: 'POST',
				body: JSON.stringify({ booking_id: bookingId, amount })
			});
			return response;
		},
		async updateStatus(id, status) {
			const response = await request(Endpoints.payments.updateStatus(id), {
				method: 'PUT',
				body: JSON.stringify({ status })
			});
			return response;
		}
	},

	reviews: {
		async create(data) {
			const response = await request(Endpoints.reviews.create, {
				method: 'POST',
				body: JSON.stringify(data)
			});
			return response;
		},
		async getTourReviews(tourId) {
			const response = await request(Endpoints.reviews.tourReviews(tourId));
			return response || [];
		},
		async delete(id) {
			const response = await request(Endpoints.reviews.delete(id), { method: 'DELETE' });
			return response;
		}
	}
};

export { getStoredUser, clearAuthData, getAccessToken, getRefreshToken };
