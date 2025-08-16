/**
 * Normalizes a UPC/EAN barcode to a consistent 13-digit format (EAN-13).
 * This handles cases where leading zeros are dropped.
 * @param code The barcode string or number to normalize.
 * @returns A 13-digit string representation of the barcode.
 */
export function normalizeUPC(code: string | number): string {
    let sanitizedCode = String(code).replace(/\D/g, '');
    if (sanitizedCode.length > 13) {
        // Remove leading zeros from the left
        while (sanitizedCode.length > 13 && sanitizedCode[0] === '0') {
            sanitizedCode = sanitizedCode.slice(1);
        }
        // If still too long, remove from the right
        if (sanitizedCode.length > 13) {
            sanitizedCode = sanitizedCode.slice(0, 13);
        }
    } else if (sanitizedCode.length < 13) {
        sanitizedCode = sanitizedCode.padStart(13, '0');
    }
    return sanitizedCode;
}
