import {error, json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {collections, createDocument, getFirstDocument, listDocuments} from '$lib/server/database';
import {Query} from 'node-appwrite';

export const GET: RequestHandler = async ({locals, url}) => {
    // Check if the user is logged in
    if (!locals.user) {
        error(401, 'Unauthorized: You must be logged in to access this resource');
    }

    // Require approval for the user
    if (!locals.user.approved) {
        error(403, 'Forbidden: You must be approved to access this resource');
    }

    const name = url.searchParams.get('name');

    if (!name) {
        error(400, 'Bad Request: You must provide a name');
    }

    const result = await listDocuments(
        collections.customers, [
            Query.search('name', name),
            Query.limit(3) // Only return up to 3 results
        ]
    );

    if (!result) {
        error(404, 'Not Found: Product not found');
    }

    return json({
        customers: result
    });
};

export const POST: RequestHandler = async ({locals, request}) => {
    // Check if the user is logged in
    if (!locals.user) {
        error(401, 'Unauthorized: You must be logged in to access this resource');
    }

    // Require approval for the user
    if (!locals.user.approved) {
        error(403, 'Forbidden: You must be approved to access this resource');
    }

    const requestData = await request.json();

    // Validate the incoming data
    if (!requestData.name) {
        error(400, 'Bad Request: You must provide a name.');
    }
    
    // Create the customer document
    const customer = await createDocument(collections.customers, {
        name: requestData.name
    });

    return json({
        customer
    });
};