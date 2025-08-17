import {APPWRITE_BUCKET_ID_APPROVED_USERS} from '$env/static/private';
import {serverClient} from '$lib/server/appwrite';
import {Storage} from 'node-appwrite';
import {InputFile} from 'node-appwrite/file';

const storage = new Storage(serverClient);

export const buckets = {
    approvedUsers: APPWRITE_BUCKET_ID_APPROVED_USERS
}

export async function createFile(bucketId: string, blob: Blob, filename: string) {
    const file = InputFile.fromBuffer(blob, filename);
    try {
        return await storage.createFile(
            bucketId,
            'unique()',
            file
        );
    } catch (error) {
        console.error(`Error creating file in bucket ${bucketId}:`, error);
        throw new Error('Failed to create file');
    }
}

export async function getFileForView(bucketId: string, fileId: string) {
    try {
        return await storage.getFileView(
            bucketId,
            fileId
        );
    } catch (error) {
        console.error(`Error fetching file ${fileId} from bucket ${bucketId}:`, error);
        throw new Error('Failed to fetch file');
    }
}

export async function getFileForPreview(bucketId: string, fileId: string) {
    try {
        return await storage.getFilePreview(
            bucketId,
            fileId,
            200, // TODO: Better preview width/height?
            200,
        );
    } catch (error) {
        console.error(`Error fetching preview for file ${fileId} from bucket ${bucketId}:`, error);
        throw new Error('Failed to fetch file preview');
    }
}
