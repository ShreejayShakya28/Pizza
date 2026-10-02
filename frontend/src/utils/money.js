// 1450 -> "$14.50"
export const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

// subtotal 1400, 15% -> 210. Must stay identical to OrderService on the server:
// multiply first, divide once, round once to whole cents.
export const calcTip = (subtotalCents, percent) => Math.round((subtotalCents * percent) / 100);
