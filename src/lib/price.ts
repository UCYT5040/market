/**
 * Normalizes a price to 4 decimal places.
 * TODO: Replace all uses of this function for the newer round function (which is meant for all values, not just money)
 * @param price The price to normalize.
 * @returns The normalized price.
 */
export function normalizePrice(price: number): number {
    return Math.round(price * 10000) / 10000;
}