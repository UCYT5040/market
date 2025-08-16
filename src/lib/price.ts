/**
 * Normalizes a price to 4 decimal places.
 * @param price The price to normalize.
 * @returns The normalized price.
 */
export function normalizePrice(price: number): number {
    return Math.round(price * 10000) / 10000;
}