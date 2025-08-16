import {error, json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {collections, getFirstDocument} from '$lib/server/database';
import {Query} from 'node-appwrite';
import {normalizeUPC} from '$lib/upc';

export const GET: RequestHandler = async ({locals, url}) => {
    // Check if the user is logged in
    if (!locals.user) {
        error(401, 'Unauthorized: You must be logged in to access this resource');
    }

    // Require approval for the user
    if (!locals.user.approved) {
        error(403, 'Forbidden: You must be approved to access this resource');
    }

    let barcode = url.searchParams.get('barcode');
    const name = url.searchParams.get('name');

    let queries;
    if (barcode) {
        barcode = normalizeUPC(barcode);
        console.log(barcode);
        queries = [
            Query.contains('barcodes', barcode)
        ];
    } else if (name) {
        queries = [
            Query.search('name', name)
        ];
    } else {
        error(400, 'Bad Request: You must provide either a barcode or a name');
    }

    const result = await getFirstDocument(
        collections.products, queries
    );

    if (!result) {
        error(404, 'Not Found: Product not found');
    }

    return json({
        product: result
    })
};