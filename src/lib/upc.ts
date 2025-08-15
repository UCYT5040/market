/**
 * Normalizes a UPC/EAN barcode to a consistent 13-digit format (EAN-13).
 * This handles cases where leading zeros are dropped.
 * @param code The barcode string or number to normalize.
 * @returns A 13-digit string representation of the barcode.
 */
export function normalizeUPC(code: string | number): string {
    const sanitizedCode = String(code).replace(/\D/g, '');
    return sanitizedCode.padStart(13, '0');
}
