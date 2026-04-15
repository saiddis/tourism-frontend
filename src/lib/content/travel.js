const UNSPLASH_IMAGE_BASE =
	'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';

/** @type {Record<string, string>} */
const destinationImages = {
	paris:
		'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
	samarkand:
		'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1600&q=80',
	istanbul:
		'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
	rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
	tokyo:
		'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
	bali: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1600&q=80',
	marrakesh:
		'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=80',
	cappadocia:
		'https://images.unsplash.com/photo-1641128320100-4e43777d85d6?auto=format&fit=crop&w=1600&q=80',
	reykjavik:
		'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=1600&q=80',
	default: UNSPLASH_IMAGE_BASE
};

/** @param {string | null | undefined} value */
function normalizeKey(value) {
	return (value || '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/**
 * @param {string | null | undefined} name
 * @param {string | null | undefined} imageUrl
 */
export function getDestinationImage(name, imageUrl) {
	if (imageUrl) return imageUrl;

	const normalized = normalizeKey(name);
	return destinationImages[normalized] || destinationImages.default;
}

/**
 * @param {{ name?: string | null, image_url?: string | null } | null | undefined} destination
 * @param {{ name?: string | null } | null | undefined} tour
 */
export function getTourImage(destination, tour) {
	return getDestinationImage(destination?.name || tour?.name, destination?.image_url);
}

/** @param {string | null | undefined} dateStr */
export function formatDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}

/** @param {string | null | undefined} dateStr */
export function formatLongDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

/** @param {string | null | undefined} dateStr */
export function formatShortDate(dateStr) {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

/** @param {number | null | undefined} price */
export function formatPrice(price) {
	if (price == null) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

/**
 * @param {string | null | undefined} startDate
 * @param {string | null | undefined} endDate
 */
export function getDayCount(startDate, endDate) {
	if (!startDate || !endDate) return 0;
	const start = new Date(startDate);
	const end = new Date(endDate);
	return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
