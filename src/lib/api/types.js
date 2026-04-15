/**
 * @typedef {'client' | 'manager' | 'admin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} created_at
 */

/**
 * @typedef {Object} Destination
 * @property {number} id
 * @property {string} name
 * @property {string | undefined} [image_url]
 * @property {string} description
 * @property {string} created_at
 */

/**
 * @typedef {Object} Tour
 * @property {number} id
 * @property {number} destination_id
 * @property {string | undefined} [destination_name]
 * @property {string | undefined} [destination_description]
 * @property {string | undefined} [destination_image_url]
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} start_date
 * @property {string} end_date
 * @property {number} capacity
 * @property {string} created_at
 */

/**
 * @typedef {'pending' | 'confirmed' | 'cancelled'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {number} id
 * @property {number} user_id
 * @property {number} tour_id
 * @property {string | undefined} [tour_name]
 * @property {string | undefined} [tour_description]
 * @property {number | undefined} [tour_price]
 * @property {string | undefined} [tour_start_date]
 * @property {string | undefined} [tour_end_date]
 * @property {number | undefined} [tour_capacity]
 * @property {number | undefined} [destination_id]
 * @property {string | undefined} [destination_name]
 * @property {string | undefined} [destination_description]
 * @property {string | undefined} [destination_image_url]
 * @property {BookingStatus} status
 * @property {string} created_at
 */

/**
 * @typedef {'pending' | 'paid' | 'failed'} PaymentStatus
 */

/**
 * @typedef {Object} Payment
 * @property {number} id
 * @property {number} booking_id
 * @property {number} amount
 * @property {PaymentStatus} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} user_id
 * @property {number} tour_id
 * @property {number} rating
 * @property {string} comment
 * @property {string} created_at
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} access_token
 * @property {string} token_type
 * @property {number} access_expires_in
 * @property {number} refresh_expires_in
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {AuthTokens} tokens
 */
