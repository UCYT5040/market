import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {getLocationTaxRates} from '$lib/server/ilTaxes';
import {collections, createDocument, getDocument} from '$lib/server/database';
import {normalizePrice} from '$lib/price';

export const load: PageServerLoad = () => {
    return {
        taxRates: getLocationTaxRates(true)
    };
};

export const actions = {
    default: async ({request, locals}) => {
        if (!locals.user || !locals.user.approved) {
            return fail(403, {
                success: false,
                message: 'You must be logged in and approved to create a purchase report.'
            });
        }

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
        let totalLocalPrice = 0; // Total if all products had been purchased at local price

        if (pricingType == 'total') {
            totalPrice = parseFloat((formData.get('totalPrice') as string).trim());
            if (isNaN(totalPrice) || totalPrice <= 0) {
                return fail(400, {
                    success: false,
                    message: 'Total price must be a valid positive number.'
                });
            }
            totalPrice = normalizePrice(totalPrice);
            taxlessPrice = normalizePrice(totalPrice / (1 + taxRate.taxRate));
        }

        let itemsData: Record<string, {
            quantity: number,
            price: number // Estimated if pricingType is 'total', actual if 'item'
        }> = {};
        let localPrices: Record<string, number> = {}; // Store local prices for each product

        for (const product of products) {
            const quantity = parseInt(product.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return fail(400, {
                    success: false,
                    message: `Invalid quantity for product ${product.name}.`
                });
            }
            // Get local price
            try {
                const productData = await getDocument(collections.products, product.id);
                totalLocalPrice += productData.localPrice * quantity;
                localPrices[product.id] = productData.localPrice;
            } catch (error) {
                return fail(404, {
                    success: false,
                    message: `Product with ID ${product.id} not found.`
                });
            }
            if (pricingType === 'item') {
                let itemPrice = parseFloat(product.price);
                if (isNaN(itemPrice) || itemPrice <= 0) {
                    return fail(400, {
                        success: false,
                        message: `Invalid price for product ${product.name}.`
                    });
                }
                itemPrice = normalizePrice(itemPrice);
                taxlessPrice += itemPrice * quantity;
            }
            const itemPrice = pricingType === 'item' ? parseFloat(product.price) : 0; // Added after all localPrice calculations for 'total' price
            itemsData[product.id] = {
                quantity: quantity,
                price: normalizePrice(itemPrice)
            };
        }

        // If 'total' pricing, estimate individual item prices based on local price
        if (pricingType === 'total') {
            for (const [productId, itemData] of Object.entries(itemsData)) {
                itemsData[productId].price = normalizePrice(((localPrices[productId] || 0) * itemData.quantity) / totalLocalPrice * taxlessPrice);
                console.log(`Estimated price for product ${productId}: ${itemsData[productId].price}`);
            }
        }

        if (taxlessPrice <= 0) {
            return fail(400, {
                success: false,
                message: 'Total taxless price must be a valid positive number.'
            });
        }

        if (pricingType === 'item') {
            totalPrice = normalizePrice(taxlessPrice * (1 + taxRate.taxRate));
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
                purchasedItemsJSON: JSON.stringify(itemsData)
            }
        );

        if (!result) {
            return fail(500, {
                success: false,
                message: 'Failed to create purchase report.'
            });
        }

        return redirect(303, `/dashboard/purchase-report/${result.$id}`); // Redirect to the newly created report
    }
} satisfies Actions;
