import type {PageServerLoad} from './$types';
import {fail} from '@sveltejs/kit';
import {collections, getDocument, listDocuments} from '$lib/server/database';
import {Query, Users} from 'node-appwrite';
import {serverClient} from '$lib/server/appwrite';

export const load: PageServerLoad = async ({url, locals}) => {
    // TODO: Try/catch all database operations to handle errors gracefully
    const page = parseInt(url.searchParams.get('page') || '1');
    const includeAll = url.searchParams.get('includeAll') === 'true';
    const status = url.searchParams.get('status') || 'pending';

    if (!locals.user) { // Unexpected case
        return fail(401, {
            success: false,
            message: 'You must be logged in to view purchase reports.'
        });
    }

    const reports = await listDocuments(collections.purchaseReports, [
        Query.limit(10),
        Query.offset((page - 1) * 10),
        Query.orderDesc('$updatedAt'),
        Query.equal('status', 'pending'),
        ...(includeAll ? [] : [Query.equal('user', locals.user.id)]),
        ...(status === 'all' ? [] : [Query.equal('status', status)])
    ]);

    for (const report of reports) {
        // Check for attachments
        report.attachments = await listDocuments(collections.purchaseReportAttachments, [
            Query.equal('report', report.$id),
            Query.orderAsc('$createdAt')
        ]) || [];
        const items = JSON.parse(report.purchasedItemsJSON);
        // Get item data
        report.items = [];
        let totalLocalPrice = 0; // Total if all products had been purchased at local price
        for (const [productId, productData] of Object.entries(items)) {
            const quantity = productData.quantity;
            if (isNaN(quantity) || quantity <= 0) {
                console.warn(`Invalid quantity for product ${productId} in report ${report.$id}:`, quantity);
                continue; // Skip invalid quantities
            }
            try {
                const product = await getDocument(collections.products, productId);
                report.items.push({
                    ...product,
                    price: productData.price, // Use price from productData
                    quantity: quantity
                });
                totalLocalPrice += product.localPrice * quantity;
            } catch (error) {
                console.error(`Failed to fetch product ${productId} for report ${report.$id}:`, error);
                report.items.push({
                    $id: productId,
                    name: 'Unknown Product',
                    price: productData.price,
                    localPrice: 0,
                    quantity: quantity
                });
            }
        }
        report.totalLocalPrice = totalLocalPrice; // Store total local price for the report
        // Get the user who created the report
        const users = new Users(serverClient);
        try {
            const user = await users.get(report.user);
            report.username = user.name || 'Unknown User';
        } catch (error) {
            console.error(`Failed to fetch user for report ${report.$id}:`, error);
            report.username = 'Unknown User'; // Fallback if user fetch fails
        }
    }

    return {
        reports: reports,
        page: page,
        includeAll: includeAll,
        status: status
    }
};
