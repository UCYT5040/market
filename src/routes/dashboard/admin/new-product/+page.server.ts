import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {collections, createDocument} from '$lib/server/database';


export const actions = {
    default: async ({request, cookies}) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const barcodes = formData.get('barcodes')?.toString().trim();
        const localPrice = formData.get('localPrice')?.toString().trim();
        const minPrice = formData.get('minPrice')?.toString().trim();
        const maxPrice = formData.get('maxPrice')?.toString().trim();

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

        const result = await createDocument(
            collections.products, {
                name: name,
                barcodes: barcodes.split(',').map(b => b.trim()),
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
