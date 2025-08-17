import {error} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {buckets, getFileForPreview, getFileForView} from '$lib/server/storage';

export const GET: RequestHandler = async ({locals, url}) => {
    // Check if the user is logged in
    if (!locals.user) {
        error(401, 'You must be logged in to access this resource');
    }

    // Ensure user is authenticated
    if (!locals.user.approved) {
        error(403, 'You must be approved to access this resource');
    }

    const file = url.searchParams.get('file');
    const preview = url.searchParams.get('preview') === 'true';

    if (!file) {
        error(400, 'No file specified');
    }

    let arrayBuffer;
    if (preview) {
        arrayBuffer = await getFileForPreview(buckets.approvedUsers, file);
    } else {
        arrayBuffer = await getFileForView(buckets.approvedUsers, file);
    }

    if (!arrayBuffer) {
        error(404, 'File not found');
    }

    return new Response(arrayBuffer, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file}"`
        }
    });
};