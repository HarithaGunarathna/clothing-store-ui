// Item prices from the API are plain LKR amounts (e.g. 4500, 18000) — no
// minor-unit scaling.
export const formatPrice = (amount) => `Rs. ${amount.toLocaleString()}`;
