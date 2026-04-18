import { jwtDecode } from 'jwt-decode';

/** @param {string} token */
export function decodeAccessToken(token) {
	try {
		// @ts-ignore - jwt-decode types are not fully compatible
		const decoded = jwtDecode(token);
		console.log('[JWT] Decoded:', decoded);
		return decoded;
	} catch (e) {
		console.log('[JWT] Decode error:', e);
		return null;
	}
}

/** @param {unknown} tokenData */
export function isTokenExpiringSoon(tokenData) {
	// @ts-ignore - accessing exp property on decoded token
	if (!tokenData?.exp) return true;
	const now = Math.floor(Date.now() / 1000);
	// @ts-ignore - accessing exp property on decoded token
	const expiring = tokenData.exp - now < 60;
	// @ts-ignore - accessing exp property on decoded token
	console.log('[JWT] Exp check:', { exp: tokenData.exp, now, expiring });
	return expiring;
}
