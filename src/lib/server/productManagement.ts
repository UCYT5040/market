import {fail, redirect} from '@sveltejs/kit';
import {normalizeUPC} from '$lib/upc';
import {collections, createDocument} from '$lib/server/database';

export async function manageProduct(
    request: Request,
    action: "edit" | "create"
) {
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
            message: `Failed to ${action} product.`
        });
    }

    return redirect(303, '/dashboard'); // TODO: Redirect to product page
}