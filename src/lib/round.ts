// Global round function for all values ($, sweat equity, etc.)
export function round(value: number) {
    // Round to 4 decimal places
  return Math.round(value * 10000) / 10000;
}