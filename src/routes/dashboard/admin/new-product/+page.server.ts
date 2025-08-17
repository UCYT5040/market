import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {collections, createDocument} from '$lib/server/database';
import {normalizeUPC} from '$lib/upc';


export const actions = {
    default: async ({request, locals}) => {
        if (!locals.user || !locals.user.admin) {
            return fail(403, {
                success: false,
                message: 'You must be logged in and have admin privileges to create products.'
            });
        }

        const formData = await request.formData();
        const name = (formData.get('name') as string).trim();
        const barcodes = formData.get('barcodes') as string;
        const localPrice = (formData.get('localPrice') as string).trim();
        const minPrice = (formData.get('minPrice') as string).trim();
        const maxPrice = (formData.get('maxPrice') as string).trim();

        if (!name || !barcodes || !localPrice || !minPrice || !maxPrice) {
            return fail(400, {
                success: false,
                message: 'All fields are required.'
            });
        }

        if (name.length > 64) {
            return fail(400, {
                success: false,
                message: 'Product name must be less than 64 characters.'
            });
        }

        if (isNaN(parseFloat(localPrice)) || isNaN(parseFloat(minPrice)) || isNaN(parseFloat(maxPrice))) {
            return fail(400, {
                success: false,
                message: 'Prices must be valid numbers.'
            });
        }

        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            return fail(400, {
                success: false,
                message: 'Minimum price cannot be greater than maximum price.'
            });
        }

        if (parseFloat(localPrice) < 0 || parseFloat(minPrice) < 0.01 || parseFloat(maxPrice) < 0.01) {
            return fail(400, {
                success: false,
                message: 'Prices must be positive numbers, and minimum/maximum prices must be at least 0.01.'
            });
        }

        const normalizedBarcodes = barcodes.split(',').map(b => normalizeUPC(b.trim()));

        const result = await createDocument(
            collections.products, {
                name: name,
                barcodes: normalizedBarcodes,
                localPrice: parseFloat(localPrice),
                minPrice: parseFloat(minPrice),
                maxPrice: parseFloat(maxPrice)
            }
        )

        if (!result) {
            return fail(500, {
                success: false,
                message: 'Failed to create product.'
            });
        }

        return redirect(303, '/dashboard'); // TODO: Redirect to product page
    }
} satisfies Actions;
