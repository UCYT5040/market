import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {getLocationTaxRates} from '$lib/server/ilTaxes';
import {collections, createDocument} from '$lib/server/database';

export const load: PageServerLoad = () => {
    return {
        taxRates: getLocationTaxRates(true)
    };
};

export const actions = {
    default: async ({request, locals}) => {
        const formData = await request.formData();
        const pricingType = formData.get('pricingType') as ('item' | 'total');
        const products = JSON.parse(formData.get('products') as string);
        const taxRateIndex = parseInt(formData.get('taxRateIndex') as string);
        const taxRates = getLocationTaxRates(true);
        const taxRate = taxRates[taxRateIndex];

        if (!taxRate) {
            return fail(400, {
                success: false,
                message: 'Invalid tax rate selected.'
            });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return fail(400, {
                success: false,
                message: 'No products selected.'
            });
        }

        if (pricingType !== 'item' && pricingType !== 'total') {
            return fail(400, {
                success: false,
                message: 'Invalid pricing type selected.'
            });
        }

        let totalPrice = 0;
        let taxlessPrice = 0;

        if (pricingType == 'total') {
            totalPrice = parseFloat((formData.get('totalPrice') as string).trim());
            if (isNaN(totalPrice) || totalPrice <= 0) {
                return fail(400, {
                    success: false,
                    message: 'Total price must be a valid positive number.'
                });
            }
            taxlessPrice = totalPrice / (1 + taxRate.taxRate);
        }

        let quantities: Record<string, number> = {};

        for (const product of products) {
            const quantity = parseInt(product.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return fail(400, {
                    success: false,
                    message: `Invalid quantity for product ${product.name}.`
                });
            }
            quantities[product.id] = quantity;
            if (pricingType === 'item') {
                const itemPrice = parseFloat(product.price);
                if (isNaN(itemPrice) || itemPrice <= 0) {
                    return fail(400, {
                        success: false,
                        message: `Invalid price for product ${product.name}.`
                    });
                }
                taxlessPrice += itemPrice * quantity;
            }
        }

        if (taxlessPrice <= 0) {
            return fail(400, {
                success: false,
                message: 'Total taxless price must be a valid positive number.'
            });
        }

        if (pricingType === 'item') {
            totalPrice = taxlessPrice * (1 + taxRate.taxRate);
        }

        if (!locals.user) { // Unexpected case
            return fail(401, {
                success: false,
                message: 'You must be logged in to create a purchase report.'
            });
        }

        const result = await createDocument(
            collections.purchaseReports, {
                user: locals.user.id,
                total: totalPrice,
                totalUntaxed: taxlessPrice,
                taxLocation: taxRate.name,
                taxCounty: taxRate.county,
                taxRate: taxRate.taxRate,
                purchasedItemsJSON: JSON.stringify(quantities)
            }
        );

        if (!result) {
            return fail(500, {
                success: false,
                message: 'Failed to create purchase report.'
            });
        }

        return redirect(303, '/dashboard') // TODO: Redirect to purchase report viewer instead
    }
} satisfies Actions;
