// Only works on data from https://tax.illinois.gov/research/taxrates/sales-tax-rate-machine-readable-files.html
import { readFileSync } from 'fs';
import { Decimal } from 'decimal.js';

const file = 'il_tax.txt';

function readFile() {
    try {
        const data = readFileSync(file, 'utf8');
        return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch (error) {
        console.error(`Error reading file ${file}:`, error);
        throw new Error('Failed to read tax data file');
    }
}

export interface LocationTaxRate {
    name: string;
    county: string;
    taxRate: number;
    percent: string;
}

export function getLocationTaxRates(): LocationTaxRate[] {
    // 10 chars, then 25 for location name, then 25 for county name
    // from the start again, 69 chars, then 5 for tax rate
    const data = readFile();
    const results: LocationTaxRate[] = [];
    for (const line of data) {
        const locationName = line.substring(10, 35).trim();
        const countyName = line.substring(35, 60).trim();
        const taxRateStr = line.substring(69, 74).trim();
        const taxRate = Decimal(taxRateStr).dividedBy(100000);
        if (locationName && countyName && taxRate) {
            results.push({
                name: locationName,
                county: countyName,
                taxRate: taxRate.toNumber(),
                percent: taxRate.mul(100).toString() + '%'
            });
        }
    }
    return results;
}