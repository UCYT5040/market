import type {Actions, PageServerLoad} from './$types';
import {fail} from '@sveltejs/kit';
import {collections, createDocument, getDocument, listDocuments} from '$lib/server/database';
import {Query, Users} from 'node-appwrite';
import {serverClient} from '$lib/server/appwrite';
import {buckets, createFile} from '$lib/server/storage';
import {PreviewImage} from '$lib/previewImage';

export const actions = {
    attachImage: async ({request, params, locals}) => {
        const formData = await request.formData();
        const file = formData.get('image') as Blob;
        if (!file || !(file instanceof Blob)) {
            console.warn('attachImage action called with invalid file:', file);
            return fail(400, {
                success: false,
                message: 'Invalid file provided.'
            });
        }

        const fileExt = file.type.split('/')[1];

        let result;
        try {
            result = await createFile(buckets.approvedUsers, file, `purchase-report-${params.id}-${Date.now()}.${fileExt}`);
        } catch (error) {
            console.error('Failed to upload file:', error);
        }

        if (!result) {
            return fail(500, {
                success: false,
                message: 'Failed to upload file.'
            });
        }

        // Create attachment document
        let attachment;

        try {
            attachment = await createDocument(collections.purchaseReportAttachments, {
                report: params.id,
                value: result.$id,
                type: 'image',
                user: locals.user.id
            });
        } catch (error) {
            console.error('Failed to create attachment document:', error);
        }
        if (!attachment) {
            return fail(500, {
                success: false,
                message: 'Failed to create attachment document.'
            });
        }
        // Return success
        return {
            success: true,
            message: 'File uploaded successfully.'
        };
    },
    attachText: async ({request, params, locals}) => {
        // Get form data
        const formData = await request.formData();
        const text = formData.get('text') as string;
        if (!text || typeof text !== 'string' || text.trim() === '') {
            console.warn('attachText action called with invalid text:', text);
            return fail(400, {
                success: false,
                message: 'Invalid text provided.'
            });
        }

        // Create attachment document
        let attachment;

        try {
            attachment = await createDocument(collections.purchaseReportAttachments, {
                report: params.id,
                value: text,
                type: 'text',
                user: locals.user.id
            });
        } catch (error) {
            console.error('Failed to create attachment document:', error);
        }
        if (!attachment) {
            return fail(500, {
                success: false,
                message: 'Failed to create attachment document.'
            });
        }
        // Return success
        return {
            success: true,
            message: 'Text attached successfully.'
        };
    },
    adminApprove: async ({}) => {
        // TODO
    },
    adminDeny: async ({}) => {
        // TODO
    }
} satisfies Actions;

export const load: PageServerLoad = async ({params, locals}) => {
    // TODO: Try/catch all database operations to handle errors gracefully
    // TODO: Type purchasedItemsJSON
    // TODO: Either use `report.` or use the spread + object, not both (leaning towards spread + object)
    const report = await getDocument(collections.purchaseReports, params.id);

    if (!report) {
        return fail(404, {
            success: false,
            message: 'Purchase report not found.'
        });
    }

    // Check for attachments
    const attachments = await listDocuments(collections.purchaseReportAttachments, [
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
    // Get the user who created the report
    const users = new Users(serverClient);
    let username = 'Unknown User';
    try {
        const user = await users.get(report.user);
        username = user.name || 'Unknown User';
    } catch (error) {
        console.error(`Failed to fetch user for report ${report.$id}:`, error);
    }

    // Add images & username for attachments
    for (const attachment of attachments) {
        if (attachment.type === 'image') {
            attachment.image = {
                previewURL: `/api/bucket?file=${attachment.value}&preview=true`,
                imageURL: `/api/bucket?file=${attachment.value}`
            } as PreviewImage;
        }
        const attachmentUser = await users.get(attachment.user);
        attachment.username = attachmentUser.name || 'Unknown User';
    }

    return {
        report: {
            ...report,
            username: username,
            attachments: attachments,
            totalLocalPrice: totalLocalPrice
        }
    };
};
